import { updatePortfolioAfterBuy, updatePortfolioAfterSell } from "../services/portfolioManagementService.js";

export const updatePortfolioAfterBuyController = async (req, res) => {
  try {
    const {
      amount,
      mode,
    } = req.body;

    const portfolio = await updatePortfolioAfterBuy({
      amount,
      mode,
    });

    res.status(200).json({
      success: true,
      message: "Portfolio updated successfully",
      data: portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updatePortfolioAfterSellController = async (
  req,
  res,
) => {
  try {
    const {
      sellAmount,
      investedAmountRemoved,
      realizedPnL,
      mode,
    } = req.body;

    const portfolio = await updatePortfolioAfterSell({
      sellAmount,
      investedAmountRemoved,
      realizedPnL,
      mode,
    });

    res.status(200).json({
      success: true,
      message: "Portfolio updated after SELL successfully",
      data: portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};