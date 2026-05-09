import { Request, Response, NextFunction } from 'express';
import { sendError } from '../response.helper';

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[Error] ${err.message}`);

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  sendError(res, 'Internal server error', 500);
};
