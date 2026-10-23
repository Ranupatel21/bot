import express from "express";

import {
  executeSellFlowController,
} from "../controller/sellExecutionController.js";

const router = express.Router();

router.post("/sell", executeSellFlowController);

export default router;