import { Request, Response } from 'express';
import Product from '../models/product';

// Получает список всех товаров
export const getProducts = async (req: Request, res: Response) => {
  try {
    const items = await Product.find();
    res.send({
      items,
      totsl: items.length,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Ошибка на стороне сервера',
    });
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
    res.status(201).send(newProduct);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).send({
        message: 'Товар с таким title уже существует',
      });
    }
    res.status(400).send({
      message: 'Некорректные данные при создании товара',
    });
  }
};
