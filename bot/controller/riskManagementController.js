import { validateTradeRisk } from "../services/riskManagementService.js";

export const validateRisk = async (req, res) => {
  try {
    const {
      signal,
      tradeAmount,
      portfolioBalance,
      config,
    } = req.body;

    const result = validateTradeRisk({
      signal,
      tradeAmount,
      portfolioBalance,
      config,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};