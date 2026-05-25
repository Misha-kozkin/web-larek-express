import express, { Response, Request, NextFunction  } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { errors } from 'celebrate';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import errorHandler from './middlewares/error-handler';
import { requestLogger, errorLogger } from './middlewares/logger';
import  NotFoundError from './errors/not-found-error';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_ADDRESS = process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek';

app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Подключаем роуты товаров
app.use('/product', productRouter);
app.use('/order', orderRouter);

app.use((_req: Request, _res: Response, _next: NextFunction) => {
  _next(new NotFoundError('Ресурс не найден'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);


async function connect() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(DB_ADDRESS);
    console.log(`Успешное подключение к БД ${DB_ADDRESS}`);

    app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
  } catch (error) {
    console.log(`Ошибка подключения к БД ${DB_ADDRESS}`, error)
  }
}

connect();