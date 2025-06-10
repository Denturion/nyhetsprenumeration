import { RequestHandler, Router } from "express";
import { createArticle, deleteArticleById, getArticleById, getArticles, updateArticleById } from "../controllers/articlesController";
import { authenticateJWT } from "../middleware/auth"; 
import { ArticleParamas } from "../models/ArticleInput";
const router = Router();

router.get("/", authenticateJWT,getArticles);
router.get("/:id",authenticateJWT , getArticleById);
router.post("/",authenticateJWT , createArticle);
router.delete("/:id",authenticateJWT, deleteArticleById as RequestHandler<ArticleParamas>);
router.patch("/:id",authenticateJWT, updateArticleById as RequestHandler<ArticleParamas>);

export default router;
