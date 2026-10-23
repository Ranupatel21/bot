export const evaluateStrategy = ({
  marketData,
  position = null,
  config = {},
}) => {
  const {
    minLiquidity = 10000,
    minMarketCap = 50000,
    takeProfitPercent = 5,
    stopLossPercent = 2,
  } = config;

  if (!marketData) {
    throw new Error("Market data is required");
  }

  const {
    currentPrice = 0,
    liquidity = 0,
    marketCap = 0,
  } = marketData;

  if (currentPrice <= 0) {
    return {
      signal: "HOLD",
      reason: "Invalid token price",
    };
  }

  // Existing position → check exit conditions
  if (position && position.status === "OPEN") {
    const entryPrice = Number(position.averageEntryPrice);

    if (entryPrice <= 0) {
      return {
        signal: "HOLD",
        reason: "Invalid position entry price",
      };
    }

    const pnlPercent =
      ((currentPrice - entryPrice) / entryPrice) * 100;

    if (pnlPercent >= takeProfitPercent) {
      return {
        signal: "SELL",
        reason: "Take profit reached",
        pnlPercent,
      };
    }

    if (pnlPercent <= -stopLossPercent) {
      return {
        signal: "SELL",
        reason: "Stop loss reached",
        pnlPercent,
      };
    }

    return {
      signal: "HOLD",
      reason: "Open position is within exit range",
      pnlPercent,
    };
  }

  // No position → check entry conditions
  if (liquidity < minLiquidity) {
    return {
      signal: "HOLD",
      reason: "Liquidity below minimum requirement",
    };
  }

  if (marketCap < minMarketCap) {
    return {
      signal: "HOLD",
      reason: "Market cap below minimum requirement",
    };
  }

  return {
    signal: "BUY",
    reason: "Entry conditions satisfied",
  };
};