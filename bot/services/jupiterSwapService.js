import { VersionedTransaction } from "@solana/web3.js";

import {
  connection,
  getWallet,
} from "./walletService.js";

const JUPITER_BASE_URL = "https://api.jup.ag/swap/v2";

const getApiKey = () => {
  const apiKey = process.env.JUPITER_API_KEY;

  if (!apiKey) {
    throw new Error("JUPITER_API_KEY is not configured");
  }

  return apiKey;
};


export const getJupiterOrder = async ({ inputMint, outputMint, amount }) => {
  if (!inputMint) throw new Error("Input mint is required");
  if (!outputMint) throw new Error("Output mint is required");
  if (!amount || amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  const wallet = getWallet();

  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount: String(amount),
    taker: wallet.publicKey.toBase58(),
  });

  const response = await fetch(
    `${JUPITER_BASE_URL}/order?${params.toString()}`,
    {
      headers: { "x-api-key": getApiKey() },
    }
  );

  const responseText = await response.text();

  console.log("Jupiter HTTP Status:", response.status);
  console.log("Jupiter Raw Response:", responseText);

  if (!response.ok) {
    throw new Error(
      `Jupiter order failed: ${response.status} ${responseText}`
    );
  }

  const order = JSON.parse(responseText);

  console.log("Jupiter Error Code:", order.errorCode);
  console.log("Jupiter Error Message:", order.errorMessage);

  if (!order.transaction) {
    throw new Error(
      `Jupiter could not build transaction: ${
        order.errorMessage || "Unknown error"
      }`
    );
  }

  return order;
};

export const executeJupiterSwap = async ({
  inputMint,
  outputMint,
  amount,
}) => {
  const wallet = getWallet();

  // 1. Get Jupiter order
  const order = await getJupiterOrder({
    inputMint,
    outputMint,
    amount,
  });

  // 2. Deserialize Jupiter transaction
  const transaction = VersionedTransaction.deserialize(
    Buffer.from(order.transaction, "base64"),
  );

  // 3. Sign transaction with bot wallet
  transaction.sign([wallet]);

  // 4. Serialize signed transaction
  const signedTransaction = Buffer.from(
    transaction.serialize(),
  ).toString("base64");

  // 5. Execute through Jupiter
  const response = await fetch(
    `${JUPITER_BASE_URL}/execute`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": getApiKey(),
      },
      body: JSON.stringify({
        signedTransaction,
        requestId: order.requestId,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Jupiter execute failed: ${response.status} ${errorText}`,
    );
  }

  const result = await response.json();

  if (result.status !== "Success") {
    throw new Error(
      `Jupiter swap failed: ${
        result.error || `code ${result.code}`
      }`,
    );
  }

  return {
    signature: result.signature,
    requestId: order.requestId,
    inputAmount: result.totalInputAmount,
    outputAmount: result.totalOutputAmount,
    inputAmountResult: result.inputAmountResult,
    outputAmountResult: result.outputAmountResult,
    router: order.router,
    feeBps: order.feeBps,
    feeMint: order.feeMint,
  };
};
