import { Joi } from 'celebrate';

const email = Joi.string().required().email();
const password = Joi.string().required();
const name = Joi.string().min(2).max(30);
const about = Joi.string().min(2).max(200);
const avatar = Joi.string().uri();
const link = Joi.string().uri();
const id24Hex = Joi.string().length(24).hex().required();

const createUserSchema = Joi.object().keys({ name, about, avatar, email, password });

const loginSchema = Joi.object().keys({ email, password });

const createCardSchema = Joi.object().keys({ name: name.required(), link: link.required() });

const updateUserSchema = Joi.object().keys({ name: name.required(), about: about.required() });

const updateAvatarSchema = Joi.object().keys({ avatar: avatar.required() });

const cardIdSchema = Joi.object().keys({ cardId: id24Hex });

const userIdSchema = Joi.object().keys({ userId: id24Hex });

export {
  userIdSchema,
  updateAvatarSchema,
  createUserSchema,
  cardIdSchema,
  createCardSchema,
  loginSchema,
  updateUserSchema,
};
