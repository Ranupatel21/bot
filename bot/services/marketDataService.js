import axios from "axios";

const DEXSCREENER_API =
  "https://api.dexscreener.com/latest/dex/tokens";

export const getTokenMarketData = async (tokenAddress) => {
  try {
    if (!tokenAddress) {
      throw new Error("Token address is required");
    }

    const response = await axios.get(
      `${DEXSCREENER_API}/${tokenAddress}`,
    );

    const pairs = response.data?.pairs;

    if (!pairs || pairs.length === 0) {
      throw new Error("No market data found for this token");
    }

    // Prefer pairs that contain market cap or FDV data
    const pairsWithMarketData = pairs.filter(
      (pair) =>
        Number(pair?.marketCap || 0) > 0 ||
        Number(pair?.fdv || 0) > 0,
    );

    const availablePairs =
      pairsWithMarketData.length > 0
        ? pairsWithMarketData
        : pairs;

    // Select pair with highest liquidity
    const bestPair = availablePairs.reduce(
      (best, current) => {
        const bestLiquidity =
          Number(best?.liquidity?.usd || 0);

        const currentLiquidity =
          Number(current?.liquidity?.usd || 0);

        return currentLiquidity > bestLiquidity
          ? current
          : best;
      },
      availablePairs[0],
    );

    const marketCap =
      Number(bestPair.marketCap || 0) > 0
        ? Number(bestPair.marketCap)
        : Number(bestPair.fdv || 0) > 0
          ? Number(bestPair.fdv)
          : null;

    return {
      tokenAddress,
      symbol: bestPair.baseToken?.symbol || null,
      name: bestPair.baseToken?.name || null,
      network: bestPair.chainId || "solana",
      currentPrice: Number(bestPair.priceUsd || 0),
      liquidity: Number(bestPair.liquidity?.usd || 0),
      marketCap,
      pairAddress: bestPair.pairAddress || null,
      dexId: bestPair.dexId || null,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch market data",
    );
  }
};