import express from "express";

import {
  createTrade,
  getTrades,
  getExecutedTrades,
} from "../controller/tradeController.js";

const router = express.Router();

router.post("/", createTrade);
router.get("/", getTrades);
router.get("/executed", getExecutedTrades);

export default router;