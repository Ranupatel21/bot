import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    tokenAddress: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    symbol: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      default: null,
    },

    network: {
      type: String,
      default: "solana",
    },

    currentPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    liquidity: {
      type: Number,
      default: 0,
      min: 0,
    },

    marketCap: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

const Token = mongoose.model("Token", tokenSchema);

export default Token;