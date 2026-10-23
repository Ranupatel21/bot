import Token from "../models/token.js";

export const createToken = async (req, res) => {
  try {
    const token = await Token.create(req.body);

    res.status(201).json({
      success: true,
      message: "Token created successfully",
      data: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTokens = async (req, res) => {
  try {
    const tokens = await Token.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};