import Trade from "../models/trade.js";

export const executePaperTrade = async ({
  tokenAddress,
  side,
  quantity,
  price,
}) => {
  if (!tokenAddress) {
    throw new Error("Token address is required");
  }

  if (!["BUY", "SELL"].includes(side)) {
    throw new Error("Invalid trade side");
  }

  if (!quantity || quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  if (!price || price <= 0) {
    throw new Error("Price must be greater than 0");
  }

  const amount = quantity * price;

  const trade = await Trade.create({
    tokenAddress,
    side,
    quantity,
    price,
    amount,
    status: "EXECUTED",
    mode: "PAPER",
    txSignature: null,
    error: null,
    executedAt: new Date(),
  });

  return trade;
};