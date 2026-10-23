import { executePaperTrade } from "../services/tradeExecutionService.js";

export const executePaperTradeController = async (req, res) => {
  try {
    const {
      tokenAddress,
      side,
      quantity,
      price,
    } = req.body;

    const trade = await executePaperTrade({
      tokenAddress,
      side,
      quantity,
      price,
    });

    res.status(201).json({
      success: true,
      message: "Paper trade executed successfully",
      data: trade,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};