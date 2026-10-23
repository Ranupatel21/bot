import express from "express";

import { evaluateTokenStrategy } from "../controller/strategyController.js";

const router = express.Router();

router.post("/evaluate", evaluateTokenStrategy);

export default router;