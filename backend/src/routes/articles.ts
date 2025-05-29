import { Router } from "express";
import { createArticle, deleteArticleById, getArticleById, getArticles, updateArticleById } from "../controllers/articlesController";

const router = Router();

router.get("/", getArticles);
router.get("/:id", getArticleById);
router.post("/", createArticle);
router.delete("/:id", deleteArticleById);
router.patch("/:id", updateArticleById);

export default router;
