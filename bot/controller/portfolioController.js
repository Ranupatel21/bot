import Portfolio from "../models/portfolio.js";

export const createPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.create(req.body);

    res.status(201).json({
      success: true,
      message: "Portfolio created successfully",
      data: portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      mode: req.query.mode || "PAPER",
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};