import { celebrate } from 'celebrate';
import * as Schemas from '../utils/shemas-joi';

export const validateCreateUser = celebrate({ body: Schemas.createUserSchema });
export const validateLogin = celebrate({ body: Schemas.loginSchema });
export const validateCreateCard = celebrate({ body: Schemas.createCardSchema });
export const validateUpdateUser = celebrate({ body: Schemas.updateUserSchema });
export const validateUpdateAvatar = celebrate({ body: Schemas.updateAvatarSchema });
export const validateCardId = celebrate({ params: Schemas.cardIdSchema });
export const validateUserId = celebrate({ params: Schemas.userIdSchema });
