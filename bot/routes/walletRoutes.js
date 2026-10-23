import express from "express";

import {
  createWallet,
  getWallets,
  getActiveWallets,
} from "../controller/walletController.js";

const router = express.Router();

router.post("/", createWallet);

router.get("/", getWallets);

router.get("/active", getActiveWallets);

export default router;