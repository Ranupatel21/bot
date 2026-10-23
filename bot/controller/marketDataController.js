import { getTokenMarketData } from "../services/marketDataService.js";

export const getMarketData = async (req, res) => {
  try {
    const { tokenAddress } = req.params;

    const marketData = await getTokenMarketData(tokenAddress);

    res.status(200).json({
      success: true,
      data: marketData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};