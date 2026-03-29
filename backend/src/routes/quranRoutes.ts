import { Router } from 'express';
import * as quranController from '../controllers/quranController';

const router = Router();

router.get('/', quranController.getAllSurahs);
router.get('/search', quranController.searchSurah);
router.get('/amharic', quranController.getAmharicQuran);
router.get('/:id', quranController.getSurahById);

export default router;
