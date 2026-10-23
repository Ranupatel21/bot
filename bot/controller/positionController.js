import Position from "../models/position.js";

export const createPosition = async (req, res) => {
  try {
    const position = await Position.create(req.body);

    res.status(201).json({
      success: true,
      message: "Position created successfully",
      data: position,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPositions = async (req, res) => {
  try {
    const positions = await Position.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: positions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOpenPositions = async (req, res) => {
  try {
    const positions = await Position.find({
      status: "OPEN",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: positions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};