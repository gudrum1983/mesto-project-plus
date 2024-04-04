import { Router } from 'express';
import userRouter from './users';
import cardsRouter from './cards';
import authMiddleware from '../middlewares/auth';
import pageNotFound from '../controllers/notFound';

const router = Router();

router.use('/users', authMiddleware, userRouter);
router.use('/cards', authMiddleware, cardsRouter);
router.use('/*', pageNotFound);

export default router;
