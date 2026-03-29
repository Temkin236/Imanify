import { Router } from 'express';
import * as prayerController from '../controllers/prayerController';

const router = Router();

router.get('/times', prayerController.getPrayerTimes);
router.get('/today', prayerController.getTodayPrayers);
router.get('/next', prayerController.getNextPrayer);
router.get('/reminders', prayerController.getPrayerReminders);

export default router;
