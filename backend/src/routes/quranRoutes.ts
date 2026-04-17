import { Router } from 'express';
import * as quranController from '../controllers/quranController.js';

const router = Router();

router.get('/:surah/:ayah', quranController.getQuranAyah);

export default router;
