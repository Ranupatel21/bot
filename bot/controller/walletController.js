import Wallet from "../models/wallet.js";

export const createWallet = async (req, res) => {
  try {
    const wallet = await Wallet.create(req.body);

    res.status(201).json({
      success: true,
      message: "Wallet created successfully",
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: wallets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getActiveWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find({
      status: "ACTIVE",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: wallets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};