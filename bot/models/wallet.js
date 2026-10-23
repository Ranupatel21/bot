import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    network: {
      type: String,
      default: "solana",
    },

    balance: {
      type: Number,
      default: 0,
      min: 0,
    },

    mode: {
      type: String,
      enum: ["PAPER", "REAL"],
      required: true,
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

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;