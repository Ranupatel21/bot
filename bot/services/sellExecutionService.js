import Portfolio from "../models/portfolio.js";
import Position from "../models/position.js";

import { getTokenMarketData } from "./marketDataService.js";
import { evaluateStrategy } from "./strategyService.js";
import { validateTradeRisk } from "./riskManagementService.js";
import { executePaperTrade } from "./tradeExecutionService.js";
import { updatePositionAfterSell } from "./positionManagementService.js";
import { updatePortfolioAfterSell } from "./portfolioManagementService.js";

export const executeSellFlow = async ({
  tokenAddress,
  quantity,
  mode = "PAPER",
  riskConfig = {},
}) => {
  if (!tokenAddress) {
    throw new Error("Token address is required");
  }

  if (!quantity || quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  if (!["PAPER", "REAL"].includes(mode)) {
    throw new Error("Invalid trade mode");
  }

  // 1. Get current open position
  const position = await Position.findOne({
    tokenAddress,
    status: "OPEN",
    mode,
  });

  if (!position) {
    throw new Error("Open position not found");
  }

  if (quantity > position.quantity) {
    throw new Error("Sell quantity exceeds position quantity");
  }

  // 2. Get latest market data
  const marketData = await getTokenMarketData(tokenAddress);

  const price = marketData.currentPrice;

  if (!price || price <= 0) {
    throw new Error("Invalid market price");
  }

  // 3. Evaluate SELL strategy
  const strategyResult = evaluateStrategy({
    marketData,
    position,
  });

  if (strategyResult.signal !== "SELL") {
    throw new Error(
      `SELL rejected: ${strategyResult.reason}`,
    );
  }

  // 4. Calculate sell amount
  const sellAmount = quantity * price;

  // 5. Get portfolio
  const portfolio = await Portfolio.findOne({
    mode,
  });

  if (!portfolio) {
    throw new Error("Portfolio not found");
  }

  // 6. Risk validation
  const riskResult = validateTradeRisk({
    signal: strategyResult.signal,
    tradeAmount: sellAmount,
    portfolioBalance: portfolio.availableBalance,
    config: riskConfig,
  });

  if (!riskResult.allowed) {
    throw new Error(
      `SELL rejected: ${riskResult.reason}`,
    );
  }

  if (mode !== "PAPER") {
    throw new Error(
      "REAL trade execution is not implemented yet",
    );
  }

  // 7. Execute paper SELL
  const trade = await executePaperTrade({
    tokenAddress,
    side: "SELL",
    quantity,
    price,
  });

  // 8. Update position
  const positionResult = await updatePositionAfterSell({
    tokenAddress,
    quantity,
    price,
    mode,
  });

  // 9. Calculate invested amount removed
  const investedAmountRemoved =
    positionResult.averageEntryPrice * quantity;

  // 10. Update portfolio
  const updatedPortfolio =
    await updatePortfolioAfterSell({
      sellAmount,
      investedAmountRemoved,
      realizedPnL: positionResult.realizedPnL,
      mode,
    });

  return {
    marketData,
    strategy: strategyResult,
    risk: riskResult,
    trade,
    position: positionResult,
    portfolio: updatedPortfolio,
  };
};