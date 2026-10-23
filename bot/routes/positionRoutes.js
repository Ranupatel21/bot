import express from "express";

import {
  createPosition,
  getPositions,
  getOpenPositions,
} from "../controller/positionController.js";

const router = express.Router();

router.post("/", createPosition);
router.get("/", getPositions);
router.get("/open", getOpenPositions);

export default router;