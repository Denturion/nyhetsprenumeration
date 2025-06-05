/// <reference path="../types/express.d.ts" />
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../models/Token';

export const authenticateJWT = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		res.status(401).json({ message: 'No token provided' });
		return;
	}

	const token = authHeader.split(' ')[1];

	try {
		const secret = process.env.JWT_SECRET || 'secret';
		const decoded = jwt.verify(token, secret) as TokenPayload;
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: 'Invalid or expired token' });
		return;
	}
};
