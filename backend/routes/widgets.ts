import express from 'express';
import { createHeatMap } from '../controllers/calendarHeatMap';
import { getKeywords } from '../controllers/keywords';
import { getSubscriberData } from '../controllers/subscriberData';

const router = express.Router();

router.get('/calendar/:sub', createHeatMap);
router.get('/keywords/:sub', getKeywords);
router.get('/subscribers/:sub', getSubscriberData);

export { router as widgetRouter }