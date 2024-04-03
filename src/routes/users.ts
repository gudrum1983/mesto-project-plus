import { Router } from 'express';
import { createUser, getUserById, getUserMe, getUsers, updateAvatar, updateProfile } from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers); // вернуть всех пользователей
userRouter.get('/:userId', getUserById); // вернуть пользователя по ИД
userRouter.post('/', createUser); // создать пользователя
userRouter.patch('/me', updateProfile); // обновить профиль
userRouter.patch('/me/avatar', updateAvatar); // обновить аватар
userRouter.patch('/me', getUserMe); // обновить профиль
export default userRouter;
