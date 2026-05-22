import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import Product from '../models/product';

const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      payment, email, phone, address, total, items,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).send({
        message: 'Корзина заказа пуста',
      });
    }

    const dbProducts = await Product.find({ _id: { $in: items } });

    if (dbProducts.length !== items.length) {
      return res.status(400).send({
        message: 'Один или несколько товаров не найдены в базе данных',
      });
    }

    const calculatedTotal = dbProducts.reduce((sum, product) => {
      if (product.price === null) {
        throw new Error(`Товар "${product.title}" нельзя купить (цена null)`);
      }
      return sum + product.price;
    }, 0);

    if (calculatedTotal !== total) {
      return res.status(400).send({
        message: 'Общая сумма заказа не совпадает с реальной стоимостью товаров',
      });
    }

    const orderId = randomUUID();

    return res.status(201).send({
      id: orderId,
      total,
      payment,
      email,
      phone,
      address,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('нельзя купить')) {
      return res.status(400).send({ message: error.message });
    }
    const message = error instanceof Error ? error.message : 'Ошибка при оформлении заказа';
    return res.status(500).send({ message });
  }
};

export default createOrder;
