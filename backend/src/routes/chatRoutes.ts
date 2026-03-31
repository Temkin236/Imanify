import { Router } from 'express';
import * as chatController from '../controllers/chatController';

const router = Router();

router.post('/', chatController.sendMessage);

export default router;
