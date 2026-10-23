import Position from "../models/position.js";

export const updatePositionAfterBuy = async ({
  tokenAddress,
  quantity,
  price,
  mode,
}) => {
  if (!tokenAddress) {
    throw new Error("Token address is required");
  }

  if (!quantity || quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  if (!price || price <= 0) {
    throw new Error("Price must be greater than 0");
  }

  if (!["PAPER", "REAL"].includes(mode)) {
    throw new Error("Invalid trade mode");
  }

  const existingPosition = await Position.findOne({
    tokenAddress,
    status: "OPEN",
    mode,
  });

  const investedAmount = quantity * price;

  if (!existingPosition) {
    const position = await Position.create({
      tokenAddress,
      quantity,
      averageEntryPrice: price,
      currentPrice: price,
      investedAmount,
      unrealizedPnL: 0,
      unrealizedPnLPercent: 0,
      status: "OPEN",
      mode,
      openedAt: new Date(),
      closedAt: null,
    });

    return position;
  }

  const oldQuantity = existingPosition.quantity;
  const oldAveragePrice = existingPosition.averageEntryPrice;

  const newQuantity = oldQuantity + quantity;

  const newAveragePrice =
    (oldQuantity * oldAveragePrice + quantity * price) /
    newQuantity;

  existingPosition.quantity = newQuantity;
  existingPosition.averageEntryPrice = newAveragePrice;
  existingPosition.currentPrice = price;
  existingPosition.investedAmount =
    existingPosition.investedAmount + investedAmount;

  existingPosition.unrealizedPnL = 0;
  existingPosition.unrealizedPnLPercent = 0;

  await existingPosition.save();

  return existingPosition;
};
export const updatePositionAfterSell = async ({
  tokenAddress,
  quantity,
  price,
  mode,
}) => {
  if (!tokenAddress) {
    throw new Error("Token address is required");
  }

  if (!quantity || quantity <= 0) {
    throw new Error("Sell quantity must be greater than 0");
  }

  if (!price || price <= 0) {
    throw new Error("Sell price must be greater than 0");
  }

  if (!["PAPER", "REAL"].includes(mode)) {
    throw new Error("Invalid trade mode");
  }

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

  const averageEntryPrice = position.averageEntryPrice;

  const investedAmountToRemove =
    quantity * averageEntryPrice;

  const remainingQuantity =
    position.quantity - quantity;

  position.quantity = remainingQuantity;

  position.investedAmount =
    position.investedAmount - investedAmountToRemove;

  position.currentPrice = price;

  position.unrealizedPnL = 0;
  position.unrealizedPnLPercent = 0;

  if (remainingQuantity === 0) {
    position.status = "CLOSED";
    position.closedAt = new Date();
    position.investedAmount = 0;
  }

  await position.save();

  return {
    position,
    soldQuantity: quantity,
    sellPrice: price,
    averageEntryPrice,
    realizedPnL:
      (price - averageEntryPrice) * quantity,
  };
};