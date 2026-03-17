export class YouTubeService {
  static extractVideoId(url) {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  static async getTranscript(videoId) {
    try {
      console.log(`Attempting to fetch content for video: ${videoId}`);
      
      // Primary method: Get video description as reliable fallback
      let content = await this.getVideoDescription(videoId);
      if (content) return content;
      
      // Secondary: Try basic YouTube metadata
      content = await this.getYouTubeMetadata(videoId);
      if (content) return content;
      
      // Tertiary: Try transcript endpoints (likely to fail but worth trying)
      content = await this.tryTranscriptEndpoints(videoId);
      if (content) return content;
      
      // Last resort: Return basic video info
      return `Video ID: ${videoId}\n\nNote: Unable to fetch video content. This may be due to network restrictions or the video being unavailable.`;
    } catch (error) {
      console.error('Content fetch error:', error.message);
      // Always return something rather than failing
      return `Video ID: ${videoId}\n\nNote: Unable to fetch video content due to restrictions. The AI will attempt to summarize based on the video ID and general knowledge.`;
    }
  }

  static async getVideoDescription(videoId) {
    try {
      console.log('Trying to get video description...');
      
      // Try multiple Invidious instances for video metadata
      const instances = [
        'https://yewtu.be',
        'https://invidious.snopyta.org',
        'https://yewtu.be'
      ];
      
      for (const instance of instances) {
        try {
          const response = await fetch(`${instance}/api/v1/videos/${videoId}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; VideoSummarizer/1.0)'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log(`Got metadata from ${instance}`);
            
            let content = '';
            
            // Add title
            if (data.title) {
              content += `Title: ${data.title}\n\n`;
            }
            
            // Add description
            if (data.description && data.description.length > 50) {
              content += `Description: ${data.description}`;
            }
            
            // Add view count and date if available
            if (data.viewCount) {
              content += `\n\nViews: ${data.viewCount.toLocaleString()}`;
            }
            
            if (data.publishDate) {
              content += `\nPublished: ${data.publishDate}`;
            }
            
            if (content.length > 100) {
              console.log('Successfully got video content');
              return content;
            }
          }
        } catch (error) {
          console.log(`Instance ${instance} failed:`, error.message);
          continue;
        }
      }
      
      throw new Error('All instances failed');
    } catch (error) {
      console.log('Video description method failed');
      throw new Error('Description method failed');
    }
  }

  static async getYouTubeMetadata(videoId) {
    try {
      console.log('Trying YouTube oEmbed endpoint...');
      
      // Try YouTube's oEmbed endpoint (less likely to be blocked)
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; VideoSummarizer/1.0)'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Got YouTube oEmbed data');
        
        let content = `Title: ${data.title}\n`;
        if (data.author_name) {
          content += `Author: ${data.author_name}\n`;
        }
        if (data.description) {
          content += `\nDescription: ${data.description}`;
        }
        
        return content;
      }
      
      throw new Error('oEmbed failed');
    } catch (error) {
      console.log('YouTube metadata method failed');
      throw new Error('Metadata method failed');
    }
  }

  static async tryTranscriptEndpoints(videoId) {
    try {
      console.log('Trying transcript endpoints...');
      
      const endpoints = [
        `https://video.google.com/timedtext?v=${videoId}&lang=en&fmt=srv1`,
        `https://www.youtube-nocookie.com/timedtext?v=${videoId}&lang=en&fmt=srv1`
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          if (response.ok) {
            const text = await response.text();
            if (text && text.trim().length > 20) {
              console.log('Got transcript content');
              return this.parseTranscript(text);
            }
          }
        } catch (error) {
          continue;
        }
      }
      
      throw new Error('All transcript endpoints failed');
    } catch (error) {
      console.log('Transcript endpoints failed');
      throw new Error('Transcript method failed');
    }
  }

  static parseTranscript(xmlText) {
    try {
      // Remove XML tags and clean text
      let cleanText = xmlText
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Handle HTML entities
      cleanText = cleanText
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'");
      
      if (!cleanText || cleanText.length < 10) {
        throw new Error('No valid content after parsing');
      }
      
      return cleanText;
    } catch (error) {
      throw new Error('Failed to parse transcript');
    }
  }

  static validateYouTubeUrl(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  }

  static truncateTranscript(transcript, maxLength = 8000) {
    if (transcript.length <= maxLength) return transcript;
    
    return transcript.substring(0, maxLength) + '...[transcript truncated]';
  }
}
