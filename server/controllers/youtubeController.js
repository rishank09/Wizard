import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { Groq } from "groq-sdk";
import { YouTubeService } from "../services/youtubeService.js";

const AI = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const summarizeYouTubeVideo = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { videoUrl } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Free usage limit exceeded. Upgrade to continue.",
      });
    }

    if (!videoUrl) {
      return res.json({
        success: false,
        message: "YouTube video URL is required",
      });
    }

    if (!YouTubeService.validateYouTubeUrl(videoUrl)) {
      return res.json({
        success: false,
        message: "Invalid YouTube URL format",
      });
    }

    const videoId = YouTubeService.extractVideoId(videoUrl);
    if (!videoId) {
      return res.json({
        success: false,
        message: "Could not extract video ID from URL",
      });
    }

    const transcript = await YouTubeService.getTranscript(videoId);
    
    if (!transcript || transcript.trim().length === 0) {
      return res.json({
        success: false,
        message: "No transcript available for this video",
      });
    }

    const truncatedTranscript = YouTubeService.truncateTranscript(transcript);

    const prompt = `Please provide a comprehensive summary of the following YouTube video transcript. Include the main topics, key points, and any important insights. Return the summary in a well-structured format.

Transcript:
${truncatedTranscript}`;

    const response = await AI.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    const summary = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type) 
      VALUES (${userId}, ${videoUrl}, ${summary}, 'youtube-summary')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ 
      success: true, 
      summary: summary,
      videoId: videoId,
      transcriptLength: transcript.length
    });

  } catch (error) {
    console.error(error);
    res.json({ 
      success: false, 
      message: error.message 
    });
  }
};
