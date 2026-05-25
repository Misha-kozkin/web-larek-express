import { Request, Response } from 'express';
import Product from '../models/product';

// Получает список всех товаров
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const items = await Product.find();
    return res.send({
      items,
      total: items.length,
    });
  } catch (error) {
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

// Создает новый товар
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      title, image, category, description, price,
    } = req.body;
    const newProduct = await Product.create({
      title,
      image,
      category,
      description,
      price,
    });
    return res.status(201).send(newProduct);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return res.status(409).send({
        message: 'Товар с таким title уже существует',
      });
    }

    return res.status(400).send({
      message: 'Некорректные данные при создании товара',
    });
  }
};
