import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { Groq } from "groq-sdk";
import { CodeService } from "../services/codeService.js";

const AI = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const explainCode = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { code, language } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Free usage limit exceeded. Upgrade to continue.",
      });
    }

    if (!code || !language) {
      return res.json({
        success: false,
        message: "Both code and programming language are required",
      });
    }

    if (!CodeService.validateProgrammingLanguage(language)) {
      return res.json({
        success: false,
        message: `Unsupported programming language: ${language}`,
      });
    }

    const sanitizedCode = CodeService.sanitizeCode(code);
    const prompt = CodeService.generateCodeExplanationPrompt(sanitizedCode, language);

    const response = await AI.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    let aiResponse;
    try {
      // Clean the AI response before parsing
      const cleanedResponse = CodeService.cleanAIResponse(response.choices[0].message.content);
      aiResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError.message);
      console.error('Raw response:', response.choices[0].message.content);
      
      // Fallback to plain text if JSON parsing fails
      aiResponse = {
        explanation: response.choices[0].message.content,
        complexity: "Unable to analyze",
        improvements: [],
        optimized_code: ""
      };
    }

    const result = {
      explanation: aiResponse.explanation || "No explanation provided",
      complexity: aiResponse.complexity || "Unable to analyze",
      improvements: Array.isArray(aiResponse.improvements) ? aiResponse.improvements : [],
      optimized_code: aiResponse.optimized_code || ""
    };

    await sql`
      INSERT INTO creations (user_id, prompt, content, type) 
      VALUES (${userId}, ${`Code explanation for ${language}`}, ${JSON.stringify(result)}, 'code-explanation')
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
      ...result
    });

  } catch (error) {
    console.error(error);
    res.json({ 
      success: false, 
      message: error.message 
    });
  }
};
