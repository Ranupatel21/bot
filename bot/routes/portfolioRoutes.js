import express from "express";
import {
  createPortfolio,
  getPortfolio,
} from "../controller/portfolioController.js";

const router = express.Router();

router.post("/", createPortfolio);

router.get("/", getPortfolio);

export default router;