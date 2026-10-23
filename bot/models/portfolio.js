import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: ["PAPER", "REAL"],
      required: true,
      unique: true,
    },

    initialBalance: {
      type: Number,
      required: true,
      min: 0,
    },

    availableBalance: {
      type: Number,
      required: true,
      min: 0,
    },

    investedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    realizedPnL: {
      type: Number,
      default: 0,
    },

    unrealizedPnL: {
      type: Number,
      default: 0,
    },

    totalPnL: {
      type: Number,
      default: 0,
    },

    totalTrades: {
      type: Number,
      default: 0,
      min: 0,
    },

    winningTrades: {
      type: Number,
      default: 0,
      min: 0,
    },

    losingTrades: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "PAUSED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;