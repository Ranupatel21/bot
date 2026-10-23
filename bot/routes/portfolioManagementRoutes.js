import express from "express";

import {
  updatePortfolioAfterBuyController,  updatePortfolioAfterSellController,
} from "../controller/portfolioManagementController.js";

const router = express.Router();

router.post("/buy", updatePortfolioAfterBuyController);
router.post(
  "/sell",
  updatePortfolioAfterSellController,
);
export default router;