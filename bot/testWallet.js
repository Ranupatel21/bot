
import "dotenv/config";

import {
  getWalletAddress,
  getWalletBalance,
  verifySolanaConnection,
} from "./services/walletService.js";

try {
  const connection = await verifySolanaConnection();
  const balance = await getWalletBalance();

  console.log("Connection:", connection.connected);
  console.log("Network:", connection.network);
  console.log("Wallet:", connection.walletAddress);
  console.log("Balance:", balance, "SOL");
  console.log("Wallet check passed ✅");
} catch (error) {
  console.error("Wallet check failed:", error.message);
  process.exitCode = 1;
}
