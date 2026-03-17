import express from "express";
import { summarizeYouTubeVideo } from "../controllers/youtubeController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/summarize", auth, summarizeYouTubeVideo);

export default router;
