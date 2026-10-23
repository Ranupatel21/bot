import express from "express";

import {
  executePaperTradeController,
} from "../controller/tradeExecutionController.js";

const router = express.Router();

router.post("/paper", executePaperTradeController);

export default router;