import { Router } from "express";
import { createArticle, deleteArticleById, getArticleById, getArticles, updateArticleById } from "../controllers/articlesController";
import { authenticateJWT } from "../middleware/auth"; 
const router = Router();

router.get("/", authenticateJWT,getArticles);
router.get("/:id",authenticateJWT , getArticleById);
router.post("/", createArticle);
router.delete("/:id", deleteArticleById);
router.patch("/:id", updateArticleById);

export default router;
