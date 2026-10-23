import "dotenv/config";
import {
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

import {
  connection,
  getWallet,
  getWalletAddress,
} from "./services/walletService.js";

const wallet = getWallet();
const sender = wallet.publicKey;

console.log("Sender:", getWalletAddress());

const balanceBefore = await connection.getBalance(sender);

console.log(
  "Balance Before:",
  balanceBefore / LAMPORTS_PER_SOL,
  "SOL"
);

// Send to the SAME wallet for testing.
// This tests transaction creation + signing + confirmation
// without sending funds to another address.
const recipient = new PublicKey(sender.toBase58());

const transaction = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: sender,
    toPubkey: recipient,
    lamports: 0.001 * LAMPORTS_PER_SOL,
  })
);

const { blockhash, lastValidBlockHeight } =
  await connection.getLatestBlockhash("confirmed");

transaction.recentBlockhash = blockhash;
transaction.lastValidBlockHeight = lastValidBlockHeight;
transaction.feePayer = sender;

console.log("Sending transaction...");

const signature = await connection.sendTransaction(
  transaction,
  [wallet]
);

console.log("Transaction Signature:", signature);

await connection.confirmTransaction(
  {
    signature,
    blockhash,
    lastValidBlockHeight,
  },
  "confirmed"
);

const balanceAfter = await connection.getBalance(sender);

console.log(
  "Balance After:",
  balanceAfter / LAMPORTS_PER_SOL,
  "SOL"
);

console.log("Transaction Confirmed ✅");