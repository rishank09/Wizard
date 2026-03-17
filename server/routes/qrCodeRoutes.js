import express from "express";
import { generateQRCode } from "../controllers/qrCodeController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/generate", auth, generateQRCode);

export default router;
