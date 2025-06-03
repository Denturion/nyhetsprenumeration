import express from 'express';
import {
	updateSubscriptionLevel,
	userLogin,
	userRegister,
} from '../controllers/customerController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin);

router.put('/subscription', authenticateJWT, updateSubscriptionLevel);

export default router;
