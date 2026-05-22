import { Response, Request, NextFunction } from 'express';

interface IAppError extends Error {
  statusCode?: number;
  code?: number;
}

const errorHandler = (
  err: IAppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err.code === 11000) {
    return res.status(409).send({
      message: 'Товар с таким заголовком (title) уже существует',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'На сервере произошла ошибка';

  return res.status(statusCode).send({ message });
};

export default errorHandler;
