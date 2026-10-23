import { executeSellFlow } from "../services/sellExecutionService.js";

export const executeSellFlowController = async (req, res) => {
  try {
    const {
      tokenAddress,
      quantity,
      mode,
      riskConfig,
    } = req.body;

    const result = await executeSellFlow({
      tokenAddress,
      quantity,
      mode,
      riskConfig,
    });

    res.status(201).json({
      success: true,
      message: "SELL flow executed successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};