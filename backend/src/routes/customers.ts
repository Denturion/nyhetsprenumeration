import express from 'express';
import {
	cancelSubscription,
	updateSubscriptionLevel,
	userLogin,
	userRegister,
} from '../controllers/customerController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/cancel-subscription', cancelSubscription);

router.put('/subscription', authenticateJWT, updateSubscriptionLevel);

export default router;
