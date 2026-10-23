import "dotenv/config";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

import { connection } from "./services/walletService.js";

const address = new PublicKey(
  process.env.SOLANA_WALLET_ADDRESS
);

console.log("Requesting Devnet SOL...");

const signature = await connection.requestAirdrop(
  address,
  1 * LAMPORTS_PER_SOL
);

await connection.confirmTransaction(signature, "confirmed");

const balance = await connection.getBalance(address);

console.log("Airdrop successful");
console.log("Transaction:", signature);
console.log("Balance:", balance / LAMPORTS_PER_SOL, "SOL");