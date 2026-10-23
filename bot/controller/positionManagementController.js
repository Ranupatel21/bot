import { updatePositionAfterBuy,updatePositionAfterSell, } from "../services/positionManagementService.js";

export const updatePositionAfterBuyController = async (req, res) => {
  try {
    const {
      tokenAddress,
      quantity,
      price,
      mode,
    } = req.body;

    const position = await updatePositionAfterBuy({
      tokenAddress,
      quantity,
      price,
      mode,
    });

    res.status(200).json({
      success: true,
      message: "Position updated successfully",
      data: position,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updatePositionAfterSellController = async (
  req,
  res,
) => {
  try {
    const {
      tokenAddress,
      quantity,
      price,
      mode,
    } = req.body;

    const result = await updatePositionAfterSell({
      tokenAddress,
      quantity,
      price,
      mode,
    });

    res.status(200).json({
      success: true,
      message: "Position updated after SELL successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};