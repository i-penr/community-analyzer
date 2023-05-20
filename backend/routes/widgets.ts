import express from 'express';
import { createHeatMap } from '../controllers/calendarHeatMap';

const router = express.Router();

router.get('/calendar/:sub', createHeatMap);

export { router as widgetRouter }