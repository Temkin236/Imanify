import { Router } from 'express';
import * as qiblaController from '../controllers/qiblaController.js';

const router = Router();

router.get('/', qiblaController.getQiblaDirection);

export default router;
