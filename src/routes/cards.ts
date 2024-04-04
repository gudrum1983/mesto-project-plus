import { Router } from 'express';
import { createCard, dislikeCard, getCards, likeCard, remoteCard } from '../controllers/cards';
import { validateCardId, validateCreateCard } from '../middlewares/validate';

const cardsRouter = Router();

cardsRouter.get('/', getCards); // вернуть все карточки
cardsRouter.post('/', validateCreateCard, createCard); // создать карточку
cardsRouter.delete('/:cardId', validateCardId, remoteCard); // удалить карточку по ИД
cardsRouter.put('/:cardId/likes', validateCardId, likeCard); // поставить лайк
cardsRouter.delete('/:cardId/likes', validateCardId, dislikeCard); // убрать лайк

export default cardsRouter;
