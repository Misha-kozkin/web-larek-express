import { Response, Request, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code === 11000) {
    return res.status(409).send({
      message: 'Товар с таким заголовком (title) уже существует',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'На сервере произошла ошибка';

  res.status(statusCode).send({
    message,
  });
};
