import { Router } from 'express';
import * as qiblaController from '../controllers/qiblaController';

const router = Router();

router.get('/', qiblaController.getQiblaDirection);

export default router;
