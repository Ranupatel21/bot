import express from "express";

import {
  validateRisk,
} from "../controller/riskManagementController.js";

const router = express.Router();

router.post("/validate", validateRisk);

export default router;