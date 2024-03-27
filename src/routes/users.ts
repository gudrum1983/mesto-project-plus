import { Router } from 'express';
import { createUser, getUserById, getUsers } from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', getUserById);
userRouter.patch('/me/avatar', createUser);

export default userRouter;
