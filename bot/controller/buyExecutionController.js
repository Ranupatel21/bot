import { executeBuyFlow } from "../services/buyExecutionService.js";

export const executeBuyFlowController = async (req, res) => {
  try {
    const {
      tokenAddress,
      quantity,
      mode,
      riskConfig,
    } = req.body;

    const result = await executeBuyFlow({
      tokenAddress,
      quantity,
      mode,
      riskConfig,
    });

    res.status(201).json({
      success: true,
      message: "BUY flow executed successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};