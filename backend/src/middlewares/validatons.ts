import { celebrate, Joi } from 'celebrate';

// Валидация для POST /product
export const validateProductBody = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    image: Joi.object().keys({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).required(),
    category: Joi.string().required(),
    description: Joi.string().optional().allow(''),
    price: Joi.number().optional().allow(null),
  }),
});

// Валидация для POST /order
export const validateOrderBody = celebrate({
  body: Joi.object().keys({
    payment: Joi.string().required().valid('card', 'online'),
    email: Joi.string().required().email(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().required(),
    items: Joi.array().items(Joi.string().hex().length(24)).required().min(1), // Проверяем, что это массив валидных MongoDB ID
  }),
});
