import { Request, Response } from 'express';
import { db } from '../config/db';
import { toError } from '../utility/error';
import { ArticleInput } from '../models/ArticleInput';
import { ArticleParamas } from '../models/ArticleParams';
import { ResultSetHeader } from 'mysql2';


export const getArticles = async (req: Request, res: Response): Promise<void> => {
  //byta till session när login är klart
  //jag har byggt objektet som nedan
  
  /* const user = req.session.user; */

  const user = {
    role: "admin",              // "admin" eller "user"
    levelRequired: "basic"   // "basic", "plus" eller "full"
  };

  if (!user) {
  res.status(401).json({ message: "Inte inloggad" });
  return;
  }


  const isAdmin = user.role === "admin";
  const allLevels = ["basic", "plus", "full"];

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string)?.trim();
  const offset = (page - 1) * limit;

  let searchClause = "";
  let searchParams: any[] = [];
  let allowedLevels: string[] = [];

  if (isAdmin) {
    const requestedLevel = req.query.level as string;

    if (requestedLevel && allLevels.includes(requestedLevel)) {
      allowedLevels = [requestedLevel]; 
    } else {
      allowedLevels = [...allLevels]; 
    }
  } else {
    const userIndex = allLevels.indexOf(user.levelRequired);
    allowedLevels = allLevels.slice(0, userIndex + 1);
  }

  if (search) {
  searchClause = " AND (title LIKE ?)";
  searchParams.push(`%${search}%`);
}

  const placeholders = allowedLevels.map(() => "?").join(", ");
  const whereClause = `WHERE levelRequired IN (${placeholders})${searchClause}`;

  const getArticlesQuery = `
    SELECT * FROM Huggtid.Article
    ${whereClause}
    ORDER BY \`createdAt\` DESC
    LIMIT ? OFFSET ?
  `;

  const countArticlesQuery = `
    SELECT COUNT(*) AS total FROM Huggtid.Article
    ${whereClause}
  `;

  const dataParams = [...allowedLevels,...searchParams, limit, offset];
  const countParams = [...allowedLevels,...searchParams];

  try {
    const [articles] = await db.query(getArticlesQuery, dataParams);
    const [countResult] = await db.query(countArticlesQuery, countParams);
    const totalItems = (countResult as any[])[0].total;

    res.status(200).json({
      page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      items: articles
    });
  } catch (error) {
    res.status(400).json({
      message: `Kunde inte hämta artiklar: ${
        error instanceof Error ? error.message : String(error)
      }`
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
