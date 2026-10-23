import Trade from "../models/trade.js";

export const createTrade = async (req, res) => {
  try {
    const trade = await Trade.create(req.body);

    res.status(201).json({
      success: true,
      message: "Trade created successfully",
      data: trade,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTrades = async (req, res) => {
  try {
    const trades = await Trade.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: trades,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getExecutedTrades = async (req, res) => {
  try {
    const trades = await Trade.find({
      status: "EXECUTED",
    }).sort({ executedAt: -1 });

    res.status(200).json({
      success: true,
      data: trades,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};