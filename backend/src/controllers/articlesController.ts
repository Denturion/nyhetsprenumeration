import { Request, Response } from 'express';

export const getArticles = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'ok' });
};

export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  res.json({ id: req.params.id });
};

export const createArticle = async (req: Request, res: Response): Promise<void> => {
  res.status(201).json({ message: 'Article created' });
};

export const updateArticleById = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: `Article ${req.params.id} updated` });
};

export const deleteArticleById = async (req: Request, res: Response): Promise<void> => {
  res.status(204).send();
};
