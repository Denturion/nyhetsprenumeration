import { Request, Response } from 'express';
import { db } from '../config/db';
import { toError } from '../utility/error';
import { ArticleInput } from '../models/ArticleInput';
import { ArticleParamas } from '../models/ArticleParams';
import { ResultSetHeader } from 'mysql2';

export const getArticles = async (
	req: Request,
	res: Response
): Promise<void> => {
	const user = req.user;
	if (!user) {
		res.status(401).json({ message: 'Inte inloggad' });
		return;
	}

	const isAdmin = user.role === 'admin';
	const allLevels = ['basic', 'plus', 'full'];
	const userIndex = allLevels.indexOf(user.subscriptionLevel);

	const page = parseInt(req.query.page as string) || 1;
	const limit = parseInt(req.query.limit as string) || 10;
	const search = (req.query.search as string)?.trim();
	const offset = (page - 1) * limit;

	let searchClause = '';
	let searchParams: any[] = [];

	if (search) {
		searchClause = 'AND title LIKE ?';
		searchParams.push(`%${search}%`);
	}

	try {
		let articles: any[];
		let totalItems = 0;

		if (isAdmin) {
			const getArticlesQuery = `
            SELECT * FROM Huggtid.Article
            ${search ? 'WHERE title LIKE ?' : ''}
            ORDER BY \`createdAt\` DESC
            LIMIT ? OFFSET ?
        `;
			const countArticlesQuery = `
            SELECT COUNT(*) AS total FROM Huggtid.Article
            ${search ? 'WHERE title LIKE ?' : ''}
        `;
			const dataParams = search
				? [...searchParams, limit, offset]
				: [limit, offset];
			const countParams = search ? [...searchParams] : [];
			const [rows] = await db.query(getArticlesQuery, dataParams);
			articles = rows as any[];
			const [countResult] = await db.query(countArticlesQuery, countParams);
			totalItems = (countResult as any[])[0].total;
		} else {
			const accessibleLevels = allLevels.slice(0, userIndex + 1);
			const whereClause = `WHERE levelRequired IN (${accessibleLevels
				.map(() => '?')
				.join(',')}) ${search ? 'AND title LIKE ?' : ''}`;
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
			const dataParams = [
				...accessibleLevels,
				...(search ? searchParams : []),
				limit,
				offset,
			];
			const countParams = [
				...accessibleLevels,
				...(search ? searchParams : []),
			];
			const [rows] = await db.query(getArticlesQuery, dataParams);
			articles = rows as any[];
			const [countResult] = await db.query(countArticlesQuery, countParams);
			totalItems = (countResult as any[])[0].total;
		}
		const lockedLevels = allLevels.slice(userIndex + 1);
		let lockedArticles: any[] = [];
		if (lockedLevels.length > 0) {
			const lockedWhere = `WHERE levelRequired IN (${lockedLevels
				.map(() => '?')
				.join(',')}) ${search ? 'AND title LIKE ?' : ''}`;
			const lockedQuery = `
    SELECT * FROM Huggtid.Article
    ${lockedWhere}
    ORDER BY \`createdAt\` DESC
  `;
			const lockedParams = [...lockedLevels, ...(search ? searchParams : [])];
			const [lockedRows] = await db.query(lockedQuery, lockedParams);
			lockedArticles = lockedRows as any[];
		}

		res.status(200).json({
			page,
			totalPages: Math.ceil(totalItems / limit),
			totalItems,
			items: articles,
			locked: lockedArticles,
		});
	} catch (error) {
		res.status(400).json({
			message: `Kunde inte hämta artiklar: ${
				error instanceof Error ? error.message : String(error)
			}`,
		});
		throw toError(error);
	}
};

export const getArticleById = async (
	req: Request,
	res: Response
): Promise<void> => {
	const id = req.params.id;
	const user = req.user;
	const userLevel = user?.subscriptionLevel;
	const role = user?.role;

	let sql = 'SELECT * FROM Huggtid.Article WHERE id = ?';
	try {
		const [rows] = await db.query(sql, [id]);
		const article = (rows as any[])[0];

		if (!article) {
			res.status(404).json({ message: 'Artikeln hittades inte' });
			return;
		}

		const accessLevels = ['basic', 'plus', 'full'];
		const requiredIndex = accessLevels.indexOf(article.levelRequired);
		const userIndex = accessLevels.indexOf(userLevel);

		if (role !== 'admin' && (userIndex === -1 || userIndex < requiredIndex)) {
			res
				.status(403)
				.json({ message: 'Du har inte behörighet att läsa denna artikel' });
			return;
		}

		res.status(200).json(article);
	} catch (error) {
		res.status(400).json({
			message: `Could not find any Article: ${
				error instanceof Error ? error.message : String(error)
			}`,
		});
		throw toError(error);
	}
};

export const createArticle = async (
	req: Request<{}, {}, ArticleInput>,
	res: Response
): Promise<void> => {
	let title = req.body.title;
	let content = req.body.content;
	let levelRequired = req.body.levelRequired;
	let image = req.body.image;

	let sql = `INSERT INTO Huggtid.Article
            (title, content, levelRequired,image)
             VALUES ( ?, ?, ?, ?)`;
	try {
		const [result] = await db.query<ResultSetHeader>(sql, [
			title,
			content,
			levelRequired,
			image,
		]);

		sql = 'SELECT * FROM Huggtid.Article WHERE id = ?';
		const [rows] = await db.query(sql, result.insertId);
		const articles = rows as ArticleInput[];
		const article = articles[0];

		res.status(201).json({
			message: 'Article created',
			id: result.insertId,
			created: article.createdAt,
		});
	} catch (error) {
		res.status(500).json({
			message:
				'Article not created, Needed fields: title,content,levelRequired enum:[ basic,plus,full ]',
		});
		throw toError(error);
	}
};

export const updateArticleById = async (
	req: Request<ArticleParamas, {}, ArticleInput>,
	res: Response
): Promise<void> => {
	const id = req.params.id;
	let title = req.body.title;
	let content = req.body.content;
	let levelRequired = req.body.levelRequired;
	let image = req.body.image;

	try {
		let sql = `UPDATE Huggtid.Article
    SET title = ? , content = ? , levelRequired= ? , image = ?
    WHERE id = ?`;

		const [result] = await db.query<ResultSetHeader>(sql, [
			title,
			content,
			levelRequired,
			image,
			parseInt(id),
		]);

		sql = 'SELECT * FROM Huggtid.Article WHERE id = ?';
		const [updatedRows] = await db.query(sql, [id]);

		if (result.affectedRows === 0) {
			res.status(404).json({ message: `No article found with id = ${id}` });
		} else {
			res.status(200).json({
				message: `Article ${id} is  updated`,
				article: Array.isArray(updatedRows) ? updatedRows[0] : null,
			});
		}
	} catch (error) {
		res.status(500).json({ message: 'Article not updated' });
		throw toError(error);
	}
};

export const deleteArticleById = async (
	req: Request<ArticleParamas, {}, {}>,
	res: Response
): Promise<void> => {
	const id = req.params.id;

	let sql = 'DELETE FROM Huggtid.Article WHERE id = ?';
	try {
		const [result] = await db.query(sql, [parseInt(id)]);

		if ((result as ResultSetHeader).affectedRows === 0) {
			res.status(200).json(`message: Could't find Article with id = ${id} `);
		} else {
			res
				.status(200)
				.json(`message: Successful deleted Article with id = ${id} `);
		}
	} catch (error) {
		throw toError(error);
	}
};
