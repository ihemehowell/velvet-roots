import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { productsRouter } from "./routes/products.js";
import { ordersRouter } from "./routes/orders.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  })
);
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

app.use(errorHandler);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Velvet Roots API listening on http://localhost:${port}`);
});