import { Router } from 'express';
import { getUserById, getUserMe, getUsers, updateAvatar, updateProfile } from '../controllers/users';
import { validateUpdateAvatar, validateUpdateUser, validateUserId } from '../middlewares/validate';

const userRouter = Router();

userRouter.get('/', getUsers); // вернуть всех пользователей
userRouter.get('/:userId', validateUserId, getUserById); // вернуть пользователя по ИД
userRouter.patch('/me', validateUpdateUser, updateProfile); // обновить профиль
userRouter.patch('/me/avatar', validateUpdateAvatar, updateAvatar); // обновить аватар
userRouter.patch('/me', getUserMe); // получить данные о себе
export default userRouter;
