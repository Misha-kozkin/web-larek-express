import { Router } from 'express';
import { createOrder } from '../controllers/order';
import { validateOrderBody } from '../middlewares/validatons';

const orderRouter = Router();

orderRouter.post('/', validateOrderBody, createOrder);

export default orderRouter;
