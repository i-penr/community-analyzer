import express from "express";
import { requestJob } from "../controllers/mainJob";

const router = express.Router();

router.post('/:sub', requestJob);

export { router as mainJobRouter }