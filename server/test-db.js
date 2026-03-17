import sql from "./configs/db.js";

(async () => {
  try {
    await sql`SELECT 1`;
    console.log("Database connection successful");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
  }
})();


// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function listModels() {
//   const models = await genAI.listModels();
//   console.log(models);
// }

// listModels();