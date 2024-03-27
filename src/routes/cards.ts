import { Router } from 'express';
import {
  createCard, dislikeCard, getCards, likeCard, remoteCard,
} from '../controllers/cards';

const cardsRouter = Router();

cardsRouter.get('/', getCards); // вернуть все карточки
cardsRouter.post('/', createCard); // создать карточка
cardsRouter.delete('/:cardId', remoteCard); // удалить карточку по ИД
cardsRouter.put('/:cardId/likes', likeCard); // поставить лайк
cardsRouter.delete('/:cardId/likes', dislikeCard); // убрать лайк
export default cardsRouter;
