import mongoose from "mongoose";

const positionSchema = new mongoose.Schema(
  {
    tokenAddress: {
      type: String,
      required: true,
      index: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    averageEntryPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    currentPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    investedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    unrealizedPnL: {
      type: Number,
      default: 0,
    },

    unrealizedPnLPercent: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
      index: true,
    },

    mode: {
      type: String,
      enum: ["PAPER", "REAL"],
      required: true,
    },

    openedAt: {
      type: Date,
      default: Date.now,
    },

    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Position = mongoose.model("Position", positionSchema);

export default Position;