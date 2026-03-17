export class CodeService {
  static validateProgrammingLanguage(language) {
    const supportedLanguages = [
      'javascript', 'python', 'java', 'cpp', 'c', 'csharp', 
      'php', 'ruby', 'go', 'rust', 'typescript', 'swift', 
      'kotlin', 'scala', 'r', 'sql', 'html', 'css', 'bash',
      'powershell', 'dart', 'lua', 'perl', 'haskell', 'elixir'
    ];
    
    return supportedLanguages.includes(language.toLowerCase());
  }

  static generateCodeExplanationPrompt(code, language) {
    return `Please analyze the following ${language} code and provide a comprehensive explanation in ENGLISH ONLY for a beginner developer. 

IMPORTANT: 
- Respond ONLY in English language
- Return your response as valid JSON format exactly as shown below
- Do not include any text outside the JSON structure
- Do not use markdown formatting
- Do not include code blocks in your response

JSON Structure:
{
  "explanation": "Clear, step-by-step explanation in English of what the code does",
  "complexity": "Time and space complexity analysis in English (if applicable)",
  "improvements": ["List of potential improvements or best practices in English"],
  "optimized_code": "Optimized version of the code (if applicable)"
}

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Remember: Respond only with valid JSON in English language.`;
  }

  static sanitizeCode(code) {
    if (!code || typeof code !== 'string') {
      throw new Error('Invalid code provided');
    }
    
    if (code.length > 10000) {
      throw new Error('Code too long. Maximum 10,000 characters allowed.');
    }
    
    return code.trim();
  }

  static cleanAIResponse(response) {
    // Remove any markdown code blocks or extra formatting
    let cleaned = response.trim();
    
    // Remove markdown code blocks
    cleaned = cleaned.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    
    // Remove any leading/trailing text that's not JSON
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
    }
    
    return cleaned;
  }
}
