
import Trade from "../models/trade.js";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  connection,
  getSolanaNetwork,
} from "./walletService.js";
import { executeJupiterSwap } from "./jupiterSwapService.js";

const SOL_MINT = "So11111111111111111111111111111111111111112";

export const executeRealTrade = async ({
  tokenAddress,
  side,
  solAmount,
  price,
  solPriceUsd,
}) => {
  if (!tokenAddress) throw new Error("Token address is required");
  if (side !== "BUY") {
    throw new Error("REAL SELL integration is not enabled yet");
  }
  if (!Number.isFinite(solAmount) || solAmount <= 0) {
    throw new Error("SOL spend amount must be greater than 0");
  }
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Token USD price must be greater than 0");
  }
  if (!Number.isFinite(solPriceUsd) || solPriceUsd <= 0) {
    throw new Error("SOL/USD price is invalid");
  }

  // Both settings must agree before REAL trading is allowed.
  if (process.env.TRADING_NETWORK !== "mainnet") {
    throw new Error("REAL trading blocked: TRADING_NETWORK must be mainnet");
  }
  if (getSolanaNetwork() !== "mainnet-beta") {
    throw new Error("REAL trading blocked: wallet must use Solana Mainnet");
  }

  if (!process.env.JUPITER_API_KEY) {
    throw new Error("JUPITER_API_KEY is not configured");
  }

  const mint = new PublicKey(tokenAddress);

  if (mint.toBase58() === SOL_MINT) {
    throw new Error("Cannot swap SOL for itself");
  }

  // Read token decimals before submitting a transaction.
  const supply = await connection.getTokenSupply(mint, "confirmed");
  const tokenDecimals = supply.value.decimals;

  const lamports = Math.round(solAmount * LAMPORTS_PER_SOL);

  if (!Number.isSafeInteger(lamports) || lamports <= 0) {
    throw new Error("Invalid SOL amount");
  }

  const estimatedUsd = solAmount * solPriceUsd;

  const trade = await Trade.create({
    tokenAddress,
    side: "BUY",
    quantity: 0,
    price,
    amount: estimatedUsd,
    status: "PENDING",
    mode: "REAL",
    txSignature: null,
    error: null,
  });

  let swap;

  try {
    swap = await executeJupiterSwap({
      inputMint: SOL_MINT,
      outputMint: tokenAddress,
      amount: lamports,
    });
  } 
   catch (error) {
  // Execution outcome may be uncertain.
  // Keep the trade pending until it is reconciled.
  trade.error = `Swap outcome requires reconciliation: ${error.message}`;
  await trade.save();
  throw error;
}

  // Verify the transaction signature on Solana before accounting.
  if (!swap.signature) {
    trade.error = "Missing transaction signature; reconciliation required";
    await trade.save();
    throw new Error(trade.error);
  }

  let confirmation;

try {
  confirmation = await connection.confirmTransaction(
    swap.signature,
    "confirmed"
  );
} catch (error) {
  trade.txSignature = swap.signature;
  trade.error = `Confirmation pending; reconcile signature: ${error.message}`;
  await trade.save();
  throw error;
}

if (confirmation.value.err) {
  trade.status = "FAILED";
  trade.txSignature = swap.signature;
  trade.error = `On-chain transaction failed: ${JSON.stringify(
    confirmation.value.err
  )}`;
  await trade.save();
  throw new Error(trade.error);
}a
  // Continue with actual input/output amount validation below.

  // Do not mark a submitted swap as failed just because its
  // response lacks amount data. Leave it PENDING for reconciliation.
  // const rawOutput = swap.outputAmountResult ?? swap.outputAmount;
  // const rawInput = swap.inputAmountResult ?? swap.inputAmount ?? lamports;
const rawOutput = swap.outputAmount;
const rawInput = swap.inputAmount;
  const outputRawNumber = Number(rawOutput);
  const inputLamports = Number(rawInput);

  if (
    !swap.signature ||
    !Number.isFinite(outputRawNumber) ||
    outputRawNumber <= 0 ||
    !Number.isFinite(inputLamports) ||
    inputLamports <= 0
  ) {
    trade.error =
      "Swap response needs reconciliation: missing signature or actual amounts";
    await trade.save();
    throw new Error(trade.error);
  }

  const tokenQuantity = outputRawNumber / 10 ** tokenDecimals;
  const actualSolSpent = inputLamports / LAMPORTS_PER_SOL;
  const actualAmountUsd = actualSolSpent * solPriceUsd;
  const actualTokenPriceUsd = actualAmountUsd / tokenQuantity;

  if (
    !Number.isFinite(tokenQuantity) ||
    tokenQuantity <= 0 ||
    !Number.isFinite(actualTokenPriceUsd) ||
    actualTokenPriceUsd <= 0
  ) {
    trade.error = "Invalid executed amounts; trade needs reconciliation";
    await trade.save();
    throw new Error(trade.error);
  }

  trade.quantity = tokenQuantity;
  trade.price = actualTokenPriceUsd;
  trade.amount = actualAmountUsd;
  trade.txSignature = swap.signature;
  trade.status = "EXECUTED";
  trade.error = null;
  trade.executedAt = new Date();

  await trade.save();

  return trade;
};
