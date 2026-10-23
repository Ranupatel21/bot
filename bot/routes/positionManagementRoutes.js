import express from "express";

import {
  updatePositionAfterBuyController,
   updatePositionAfterSellController,
} from "../controller/positionManagementController.js";

const router = express.Router();

router.post("/buy", updatePositionAfterBuyController);
router.post("/sell", updatePositionAfterSellController);

export default router;