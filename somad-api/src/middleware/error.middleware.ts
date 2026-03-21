import { NextFunction, Request, Response } from "express";
import { ApiError } from "../shared/errors/api-error";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, "NOT_FOUND", `Route ${req.method} ${req.originalUrl} tidak ditemukan`));
};

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      code: error.code,
      message: error.message,
      details: error.details ?? null,
    });
    return;
  }

  const message = error instanceof Error ? error.message : "Terjadi kesalahan pada server";

  res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message,
    details: null,
  });
};
