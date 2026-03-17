import express from "express";
import { explainCode } from "../controllers/codeController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/explain", auth, explainCode);

export default router;
