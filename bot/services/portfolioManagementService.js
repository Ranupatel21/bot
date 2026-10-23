import Portfolio from "../models/portfolio.js";

export const updatePortfolioAfterBuy = async ({
  amount,
  mode,
}) => {
  if (!amount || amount <= 0) {
    throw new Error("Buy amount must be greater than 0");
  }

  if (!["PAPER", "REAL"].includes(mode)) {
    throw new Error("Invalid trade mode");
  }

  const portfolio = await Portfolio.findOne({
    mode,
  });

  if (!portfolio) {
    throw new Error("Portfolio not found");
  }

  if (portfolio.availableBalance < amount) {
    throw new Error("Insufficient available balance");
  }

  portfolio.availableBalance -= amount;
  portfolio.investedAmount += amount;
  portfolio.totalTrades += 1;

  await portfolio.save();

  return portfolio;
};
export const updatePortfolioAfterSell = async ({
  sellAmount,
  investedAmountRemoved,
  realizedPnL,
  mode,
}) => {
  if (!sellAmount || sellAmount <= 0) {
    throw new Error("Sell amount must be greater than 0");
  }

  if (
    investedAmountRemoved === undefined ||
    investedAmountRemoved < 0
  ) {
    throw new Error("Invalid invested amount removed");
  }

  if (realizedPnL === undefined || realizedPnL === null) {
    throw new Error("Realized PnL is required");
  }

  if (!["PAPER", "REAL"].includes(mode)) {
    throw new Error("Invalid trade mode");
  }

  const portfolio = await Portfolio.findOne({
    mode,
  });

  if (!portfolio) {
    throw new Error("Portfolio not found");
  }

  if (investedAmountRemoved > portfolio.investedAmount) {
    throw new Error(
      "Sold invested amount exceeds portfolio invested amount",
    );
  }

  portfolio.availableBalance += sellAmount;

  portfolio.investedAmount -= investedAmountRemoved;

  portfolio.realizedPnL += realizedPnL;

  portfolio.totalPnL =
    portfolio.realizedPnL + portfolio.unrealizedPnL;

  portfolio.totalTrades += 1;

  if (realizedPnL > 0) {
    portfolio.winningTrades += 1;
  } else if (realizedPnL < 0) {
    portfolio.losingTrades += 1;
  }

  await portfolio.save();

  return portfolio;
};