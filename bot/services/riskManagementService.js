export const validateTradeRisk = ({
  signal,
  tradeAmount,
  portfolioBalance,
  config = {},
}) => {
  const {
    maxTradeAmount = 100,
    maxPositionPercent = 10,
  } = config;

  if (!signal) {
    throw new Error("Strategy signal is required");
  }

  if (signal === "HOLD") {
    return {
      allowed: false,
      reason: "Strategy signal is HOLD",
    };
  }

  if (!tradeAmount || tradeAmount <= 0) {
    return {
      allowed: false,
      reason: "Invalid trade amount",
    };
  }

  if (!portfolioBalance || portfolioBalance <= 0) {
    return {
      allowed: false,
      reason: "Insufficient portfolio balance",
    };
  }

  if (tradeAmount > portfolioBalance) {
    return {
      allowed: false,
      reason: "Trade amount exceeds available balance",
    };
  }

  if (tradeAmount > maxTradeAmount) {
    return {
      allowed: false,
      reason: "Trade amount exceeds maximum trade limit",
    };
  }

  const maxPositionAmount =
    (portfolioBalance * maxPositionPercent) / 100;

  if (tradeAmount > maxPositionAmount) {
    return {
      allowed: false,
      reason: "Trade amount exceeds maximum position size",
    };
  }

  return {
    allowed: true,
    reason: "Trade passed risk checks",
    tradeAmount,
    maxPositionAmount,
  };
};