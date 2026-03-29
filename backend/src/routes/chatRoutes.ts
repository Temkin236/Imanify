import { Router } from 'express';
import * as chatController from '../controllers/chatController';

const router = Router();

router.post('/message', chatController.sendMessage);
router.get('/history/:userId', chatController.getChatHistory);
router.delete('/history/:userId', chatController.clearChatHistory);

export default router;
