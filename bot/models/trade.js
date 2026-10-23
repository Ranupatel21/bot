import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    tokenAddress: {
      type: String,
      required: true,
      index: true,
    },

    side: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["PENDING", "EXECUTED", "FAILED", "CANCELLED"],
      default: "PENDING",
    },

    mode: {
      type: String,
      enum: ["PAPER", "REAL"],
      required: true,
    },

    txSignature: {
      type: String,
      default: null,
    },

    error: {
      type: String,
      default: null,
    },

    executedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Trade = mongoose.model("Trade", tradeSchema);

export default Trade;