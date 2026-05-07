import { NextFunction, Request, Response } from 'express';

type ErrorWithStatus = Error & {
  status?: number;
};

export const errorHandler = (err: ErrorWithStatus, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  const message = status >= 500 ? 'Internal server error' : err.message;

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ error: message });
};
