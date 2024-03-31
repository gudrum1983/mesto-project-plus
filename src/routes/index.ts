import { Request, Response, Router } from 'express';
import { constants } from 'http2';
import userRouter from './users';
import cardsRouter from './cards';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardsRouter);
// До меня не сразу дошло что за ошибка!
// Спасибо за терпение
// Надеюсь, в этот раз я правильно поняла текст замечания! :)
router.use('/*', (req: Request, res: Response) => {
  res.status(constants.HTTP_STATUS_NOT_FOUND).send('Данной страницы не существует');
});

export default router;
