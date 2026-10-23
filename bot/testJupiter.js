
import "dotenv/config";

import { getJupiterOrder } from "./services/jupiterSwapService.js";

const SOL_MINT = "So11111111111111111111111111111111111111112";
const TEST_TOKEN_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

try {
  console.log("API KEY LOADED:", Boolean(process.env.JUPITER_API_KEY));
  console.log("Testing Jupiter Order API...");

  const order = await getJupiterOrder({
    inputMint: SOL_MINT,
    outputMint: TEST_TOKEN_MINT,
    amount: 1000000,
  });

  console.log("Jupiter Order Received ✅");

  console.log("Router:", order.router);
  console.log("Request ID:", order.requestId);
  console.log("Input Amount:", order.inAmount);
  console.log("Output Amount:", order.outAmount);
  console.log("Error Code:", order.errorCode);
  console.log("Error Message:", order.errorMessage);
  console.log("Transaction Available:", Boolean(order.transaction));

} catch (error) {
  console.error("Jupiter Test Failed ❌");
  console.error("Error:", error.message);
}
