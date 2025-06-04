import { Request, Response } from 'express';
import { db } from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
	LoginRequest,
	RegisterRequest,
	UpdateSubscriptionRequest,
} from '../models/CustomerInterfaces';

// User registration

export const userRegister = async (
	req: Request<{}, {}, RegisterRequest>,
	res: Response
): Promise<void> => {
	const { email, password, subscriptionLevel } = req.body;
	if (!email || !password) {
		res.status(400).json({ message: 'Email and password required' });
		return;
	}
	try {
		const [existing] = await db.query('SELECT id FROM User WHERE email = ?', [
			email,
		]);
		if ((existing as any[]).length > 0) {
			res.status(409).json({ message: 'Email already in use' });
			return;
		}
		const password_hash = await bcrypt.hash(password, 10);

		await db.query(
			'INSERT INTO User (email, password_hash, subscriptionLevel) VALUES (?, ?, ?)',
			[email, password_hash, subscriptionLevel || 'free']
		);
		res.status(201).json({ message: 'User registered' });
	} catch (error) {
		console.error('Registration error', error);

		res.status(500).json({ message: 'Registration failed', error });
	}
};

//User login

export const userLogin = async (
	req: Request<{}, {}, LoginRequest>,
	res: Response
): Promise<void> => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400).json({ message: 'Email and password required' });
		return;
	}
	try {
		const [users] = await db.query('SELECT * FROM User WHERE email = ?', [
			email,
		]);
		const user = (users as any[])[0];

		if (!user) {
			res.status(401).json({ message: 'Invalid credentials' });
			return;
		}

		const valid = await bcrypt.compare(password, user.password_hash);
		if (!valid) {
			res.status(401).json({ message: 'Invalid credentials' });
			return;
		}

		const token = jwt.sign(
			{
				id: user.id,
				email: user.email,
				subscriptionLevel: user.subscriptionLevel,
			},
			process.env.JWT_SECRET || 'secret',
			{ expiresIn: '1d' }
		);
		res.json({ token });
	} catch (error) {
		res.status(500).json({ message: 'Login failed', error });
	}
};

// Update subscriptionLevel

export const updateSubscriptionLevel = async (
	req: Request<{}, {}, UpdateSubscriptionRequest>,
	res: Response
): Promise<void> => {
	const { subscriptionLevel } = req.body;
	const userId = (req as any).user?.id;

	if (!subscriptionLevel) {
		res.status(400).json({ message: 'subscriptionLevel required' });
		return;
	}
	try {
		await db.query('UPDATE User SET subscriptionLevel = ? WHERE id = ?', [
			subscriptionLevel,
			userId,
		]);
		res.json({ message: 'Subscription level updated' });
		return;
	} catch (error) {
		res.status(500).json({ message: 'Update failed', error });
		return;
	}
};
