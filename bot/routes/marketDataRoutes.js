import express from "express";

import { getMarketData } from "../controller/marketDataController.js";

const router = express.Router();

router.get("/:tokenAddress", getMarketData);

export default router;