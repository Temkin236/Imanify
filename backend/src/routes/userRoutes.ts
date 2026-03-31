import { Router } from 'express';
import { getProfile, postActivity } from '../controllers/userController';

const router = Router();

router.get('/profile', getProfile);
router.post('/activity', postActivity);

export default router;
