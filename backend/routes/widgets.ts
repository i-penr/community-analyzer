import express from 'express';
import { createHeatMap } from '../controllers/calendarHeatMap';
import { getKeywords } from '../controllers/keywords';

const router = express.Router();

router.get('/calendar/:sub', createHeatMap);
router.get('/keywords/:sub', getKeywords);

export { router as widgetRouter }