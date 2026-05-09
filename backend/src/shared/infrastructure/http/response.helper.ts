import { Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200): Response => {
  return res.status(statusCode).json({ success: true, data } as ApiResponse<T>);
};

export const sendError = (res: Response, message: string, statusCode = 400, errors?: string[]): Response => {
  return res.status(statusCode).json({ success: false, message, errors } as ApiResponse<never>);
};
