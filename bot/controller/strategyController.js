import { getTokenMarketData } from "../services/marketDataService.js";
import { evaluateStrategy } from "../services/strategyService.js";

export const evaluateTokenStrategy = async (req, res) => {
  try {
    const { tokenAddress, position } = req.body;

    if (!tokenAddress) {
      return res.status(400).json({
        success: false,
        message: "Token address is required",
      });
    }

    // Fetch latest market data
    const marketData = await getTokenMarketData(tokenAddress);

    // Evaluate strategy
    const strategyResult = evaluateStrategy({
      marketData,
      position: position || null,
    });

    res.status(200).json({
      success: true,
      data: {
        marketData,
        strategy: strategyResult,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};