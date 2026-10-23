import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import positionRoutes from "./routes/positionRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import marketDataRoutes from "./routes/marketDataRoutes.js";
import strategyRoutes from "./routes/strategyRoutes.js"; 
import riskManagementRoutes from "./routes/riskManagementRoutes.js";
import tradeExecutionRoutes from "./routes/tradeExecutionRoutes.js";
import positionManagementRoutes from "./routes/positionManagementRoutes.js";
import portfolioManagementRoutes from "./routes/portfolioManagementRoutes.js";
import buyExecutionRoutes from "./routes/buyExecutionRoutes.js";
import sellExecutionRoutes from "./routes/sellExecutionRoutes.js";
dotenv.config();

const app = express();

app.use(express.json());

await connectDB();
app.use("/api/tokens", tokenRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/market-data", marketDataRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/strategy", strategyRoutes);
app.use("/api/risk-management", riskManagementRoutes);
app.use("/api/trade-execution", tradeExecutionRoutes);
app.use("/api/position-management",positionManagementRoutes,);
app.use(
  "/api/portfolio-management",
  portfolioManagementRoutes,
);
app.use(
  "/api/buy-execution",
  buyExecutionRoutes,
);
app.use("/api/sell-execution", sellExecutionRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});