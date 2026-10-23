
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const RPC_URL = process.env.SOLANA_RPC_URL;
const PRIVATE_KEY = process.env.SOLANA_PRIVATE_KEY;
const NETWORK = process.env.SOLANA_NETWORK || "devnet";

if (!RPC_URL) {
  throw new Error("SOLANA_RPC_URL is not configured");
}

if (!PRIVATE_KEY) {
  throw new Error("SOLANA_PRIVATE_KEY is not configured");
}

if (!["devnet", "mainnet-beta"].includes(NETWORK)) {
  throw new Error("SOLANA_NETWORK must be devnet or mainnet-beta");
}

// Prevent accidental network mismatch.
if (
  NETWORK === "devnet" &&
  !RPC_URL.includes("devnet")
) {
  throw new Error("Devnet selected, but RPC URL is not Devnet");
}

if (
  NETWORK === "mainnet-beta" &&
  RPC_URL.includes("devnet")
) {
  throw new Error("Mainnet selected, but RPC URL is Devnet");
}

let secretKey;

try {
  const parsed = JSON.parse(PRIVATE_KEY);

  if (
    !Array.isArray(parsed) ||
    parsed.length !== 64 ||
    !parsed.every(
      (value) =>
        Number.isInteger(value) &&
        value >= 0 &&
        value <= 255
    )
  ) {
    throw new Error("Invalid secret key format");
  }

  secretKey = Uint8Array.from(parsed);
} catch {
  throw new Error(
    "SOLANA_PRIVATE_KEY must be a valid 64-byte JSON array"
  );
}

const wallet = Keypair.fromSecretKey(secretKey);

const connection = new Connection(RPC_URL, "confirmed");

const getWalletAddress = () => {
  return wallet.publicKey.toBase58();
};

const getWalletBalance = async () => {
  const lamports = await connection.getBalance(
    wallet.publicKey,
    "confirmed"
  );

  return lamports / LAMPORTS_PER_SOL;
};

const getWallet = () => wallet;

const getSolanaNetwork = () => NETWORK;

const verifySolanaConnection = async () => {
  const version = await connection.getVersion();

  return {
    connected: true,
    network: NETWORK,
    version: version["solana-core"],
    walletAddress: getWalletAddress(),
  };
};

export {
  connection,
  getWallet,
  getWalletAddress,
  getWalletBalance,
  getSolanaNetwork,
  verifySolanaConnection,
};
