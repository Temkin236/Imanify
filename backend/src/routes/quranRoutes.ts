import { Router } from 'express';
import * as quranController from '../controllers/quranController';

const router = Router();

router.get('/:surah/:ayah', quranController.getQuranAyah);

export default router;
