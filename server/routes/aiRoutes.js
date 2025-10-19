import express from "express";
 import { auth } from "../middlewares/auth.js";
 import {  generateBlogTitle,generateImage ,removeImageBackground, removeImageObject, resumeReview , generateAssignment ,contractInsights , generateCaption} from "../controllers/aiController.js";
 import { upload } from "../configs/multer.js";

 const aiRouter = express.Router();


aiRouter.post("/generate-assignment", auth, generateAssignment);
aiRouter.post("/generate-blog-title", auth, generateBlogTitle);
aiRouter.post("/generate-caption", auth, generateCaption);
aiRouter.post("/generate-image", auth, generateImage);
aiRouter.post(
    "/remove-image-background",
    upload.single("image"),
    auth,
    removeImageBackground
);
aiRouter.post(
    "/remove-image-object",
    upload.single("image"),
    auth,
    removeImageObject
);
aiRouter.post("/resume-review", upload.single("resume"), auth, resumeReview);
aiRouter.post("/contract-insights", upload.single("resume"), auth, contractInsights);

export default aiRouter;
