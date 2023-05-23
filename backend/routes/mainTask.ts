import express from "express";
import { requestJob } from "../controllers/mainTask";

const router = express.Router();

router.post('/:sub', requestJob);

export { router as mainTaskRouter }