import express from "express";
import { requestTask } from "../controllers/mainTask";

const router = express.Router();

router.post('/:sub', requestTask);

export { router as mainTaskRouter }