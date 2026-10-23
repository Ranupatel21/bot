import express from "express";

import {
  executeBuyFlowController,
} from "../controller/buyExecutionController.js";

const router = express.Router();

router.post("/buy", executeBuyFlowController);

export default router;