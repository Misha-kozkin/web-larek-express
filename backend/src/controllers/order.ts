import { Request, Response } from 'express';
import Product from '../models/product';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      paymant, email, phone, address, total, items,
    } = req.body;

    // Проверяем, что массив items передан и он не пустой
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).send({
        message: 'Корзина заказа пуста',
      });
    }

    // Ищем переданные товары в базе данных
    const dbProducts = await Product.find({ _id: { $in: items } });

    // Проверяем, все ли товары из заказа нашлись в БД
    if (dbProducts.length !== items.length) {
      return res.status(400).send({ message: 'Один или несколько товаров не найдены в базе данных' });
    }

    // Считаем правильную стоимость товаров и проверяем, продаются ли они
    let calculatedTotal = 0;

    for (const product of dbProducts) {
      if (product.price === null) { // Если у товара не указана цена
        return res.status(400).send({
          message: `Товар "${product.title}" не продается (цена не указана)`,
        });
      }
      calculatedTotal += product.price;
    }

    // Проверяем, совпадает ли стоимость
    if (calculatedTotal !== total) {
      return res.status(400).send({
        message: 'Общая сумма заказа не совпадает с реальной стоимостью товаров',
      });
    }

    // Генерируем случайный ID заказа.
    const crypto = require('crypto');
    const orderId = crypto.randomUUID();

    // ответ успеха
    res.status(201).send({
      id: orderId,
      total,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Ошибка при оформлении заказа',
    });
  }
};
