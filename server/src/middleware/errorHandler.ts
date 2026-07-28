import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error("[error]", {
    message: err.message,
    status: err.status,
    stack: err.stack,
    details: err, // Supabase errors often carry extra fields (code, hint, details)
  });

  const status = err.status ?? 500;
  res.status(status).json({
    error: status === 500 ? "Internal server error" : err.message,
  });
};