import { Keypair } from "@solana/web3.js";

const wallet = Keypair.generate();

console.log("Public Address:");
console.log(wallet.publicKey.toBase58());

console.log("\nPrivate Key:");
console.log(JSON.stringify(Array.from(wallet.secretKey)));