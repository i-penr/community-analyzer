import express from 'express';
import { getMetadata } from '../controllers/metadata';

const router = express.Router();

router.get('', getMetadata);

export { router as metadataRouter }