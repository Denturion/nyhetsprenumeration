import { Request, Response } from 'express';
import { db } from '../config/db';
import { toError } from '../utility/error';
import { ArticleInput } from '../models/ArticleInput';
import { ArticleParamas } from '../models/ArticleParams';
import { ResultSetHeader } from 'mysql2';



export const getArticles = async (req: Request, res: Response): Promise<void> => {
let sql = "SELECT * FROM Huggtid.Article"
try {
   const [rows] = await db.query(sql);
    res.status(200).json(rows)
} catch (error) {
    res.status(400).json({
  message: `Could not find any Articles: ${error instanceof Error ? error.message : String(error)}`
    });
      throw toError(error); 
}
};

export const getArticleById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    let sql = "SELECT * FROM Huggtid.Article WHERE id = ?"
    try {
     const [rows] = await db.query(sql, [id]);
    res.status(200).json(rows)
    
 } catch (error) {
    res.status(400).json({
  message: `Could not find any Article: ${error instanceof Error ? error.message : String(error)}`
    });
    throw toError(error); 
 }
};

export const createArticle = async (req: Request<{}, {}, ArticleInput>, res: Response): Promise<void> => {

let title = req.body.title;
let content = req.body.content;
let levelRequired = req.body.levelRequired;

let sql = `INSERT INTO Huggtid.Article
            (title, content, levelRequired)
             VALUES ( ?, ?, ?)`;
try {
    const [result] = await db.query<ResultSetHeader>(sql,[ title,content, levelRequired])
    
    sql = "SELECT * FROM Huggtid.Article WHERE id = ?"
    const [rows] = await db.query(sql, result.insertId)
    const articles = rows as ArticleInput[];
    const article = articles[0];
  
    
    res.status(201).json({
  message: 'Article created',
  id: result.insertId,
  created: article.createdAt
});
} catch (error) {
    res.status(500).json({ message: 'Article not created, Needed fields: title,content,levelRequired enum:[ basic,plus,full ]' });
    throw toError(error); 
}

};

export const updateArticleById = async (req: Request<ArticleParamas, {}, ArticleInput>, res: Response): Promise<void> => {

const id = req.params.id;
let title = req.body.title;
let content = req.body.content;
let levelRequired = req.body.levelRequired;

try {
    let sql = `UPDATE Huggtid.Article
    SET title = ? , content = ? , levelRequired= ? 
    WHERE id = ?`

    const [result] =await db.query<ResultSetHeader>(sql,[title, content, levelRequired, parseInt(id) ])
   
    sql = "SELECT * FROM Huggtid.Article WHERE id = ?"
    const [updatedRows] = await db.query(sql, [id])
   
    if (result.affectedRows === 0 ) {
     res.status(404).json({ message: `No article found with id = ${id}` });
    } else {
        res.status(200).json({
         message: `Article ${id} is  updated`,
         article: Array.isArray(updatedRows) ? updatedRows[0] : null
       });
    }
    
} catch (error) {
    res.status(500).json({ message: 'Article not updated' });
    throw toError(error); 
}
};

export const deleteArticleById = async (req: Request<ArticleParamas, {}, {}>, res: Response): Promise<void> => {
    const id = req.params.id; 

    let sql = "DELETE FROM Huggtid.Article WHERE id = ?"
    try {
       const [result] = await db.query(sql, [parseInt(id)])
    
        
      if ((result as ResultSetHeader).affectedRows === 0) {
          res.status(200).json(`message: Could't find Article with id = ${id} `)
      } else {
          res.status(200).json(`message: Successful deleted Article with id = ${id} `)
      }
    } catch (error) {
        throw toError(error); 
    }
};
