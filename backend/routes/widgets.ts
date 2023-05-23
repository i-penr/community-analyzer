import express from 'express';
import { createHeatMap } from '../controllers/calendarHeatMap';
import { generateKeywords } from '../controllers/keywords';

const router = express.Router();

router.get('/calendar/:sub', createHeatMap);
router.get('/keywords/:sub', generateKeywords);

export { router as widgetRouter }