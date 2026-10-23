
import Portfolio from "../models/portfolio.js";

import { getTokenMarketData } from "./marketDataService.js";
import { evaluateStrategy } from "./strategyService.js";
import { validateTradeRisk } from "./riskManagementService.js";
import { executePaperTrade } from "./tradeExecutionService.js";
import { executeRealTrade } from "./realTradeExecutionService.js";
import { updatePositionAfterBuy } from "./positionManagementService.js";
import { updatePortfolioAfterBuy } from "./portfolioManagementService.js";

const SOL_MINT = "So11111111111111111111111111111111111111112";

export const executeBuyFlow = async ({
  tokenAddress,
  quantity,
  mode = "PAPER",
  riskConfig = {},
}) => {
  if (!tokenAddress) {
    throw new Error("Token address is required");
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  if (!["PAPER", "REAL"].includes(mode)) {
    throw new Error("Invalid trade mode");
  }

  // 1. Get target token market data.
  const marketData = await getTokenMarketData(tokenAddress);

  if (!marketData.currentPrice || marketData.currentPrice <= 0) {
    throw new Error("Invalid token market price");
  }

  // 2. Evaluate existing strategy.
  const strategyResult = evaluateStrategy({ marketData });

  if (strategyResult.signal !== "BUY") {
    throw new Error(`BUY rejected: ${strategyResult.reason}`);
  }

  // 3. Find portfolio for the selected mode.
  const portfolio = await Portfolio.findOne({ mode });

  if (!portfolio) {
    throw new Error("Portfolio not found");
  }

  let tradeAmount;
  let solPriceUsd = null;

  if (mode === "PAPER") {
    // Preserve the existing PAPER calculation.
    tradeAmount = quantity * marketData.currentPrice;
  } else {
    // REAL quantity means SOL to spend.
    const solMarketData = await getTokenMarketData(SOL_MINT);
    solPriceUsd = solMarketData.currentPrice;

    if (!Number.isFinite(solPriceUsd) || solPriceUsd <= 0) {
      throw new Error("Could not get a valid SOL/USD price");
    }

    // Portfolio balance and risk limits are assumed to be USD.
    tradeAmount = quantity * solPriceUsd;
  }

  // 4. Risk validation.
  const riskResult = validateTradeRisk({
    signal: strategyResult.signal,
    tradeAmount,
    portfolioBalance: portfolio.availableBalance,
    config: riskConfig,
  });

  if (!riskResult.allowed) {
    throw new Error(`BUY rejected: ${riskResult.reason}`);
  }

  // 5. Execute selected mode.
  let trade;

  if (mode === "PAPER") {
    trade = await executePaperTrade({
      tokenAddress,
      side: "BUY",
      quantity,
      price: marketData.currentPrice,
    });
  } else {
    trade = await executeRealTrade({
      tokenAddress,
      side: "BUY",
      solAmount: quantity,
      price: marketData.currentPrice,
      solPriceUsd,
    });
  }

  // 6. Update position using the quantity and price saved in the trade.
  // PAPER retains its existing values; REAL uses the returned swap amounts.
  const position = await updatePositionAfterBuy({
    tokenAddress,
    quantity: trade.quantity,
    price: trade.price,
    mode,
  });

  // 7. Update portfolio. REAL trade.amount is calculated from SOL spent.
  const updatedPortfolio = await updatePortfolioAfterBuy({
    amount: trade.amount,
    mode,
  });

  return {
    marketData,
    strategy: strategyResult,
    risk: riskResult,
    trade,
    position,
    portfolio: updatedPortfolio,
  };
};
