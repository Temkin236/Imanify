import { Router } from 'express';
import * as prayerController from '../controllers/prayerController';

const router = Router();

router.get('/', prayerController.getPrayerTimes);

export default router;
