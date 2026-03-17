import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const models = await genAI.listModels();
    console.log("Available models:");
    models.forEach(model => {
      console.log(`- ${model.name} (Supported methods: ${model.supportedGenerationMethods?.join(", ")})`);
    });
  } catch (error) {
    console.error("Error listing models:", error.message);
  }
}

listModels();
