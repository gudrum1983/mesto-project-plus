import { Router } from 'express';
import {
  createCard, deleteLikes, getCards, putLikes, remoteCard,
} from '../controllers/cards';

const cardsRouter = Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', remoteCard);
cardsRouter.put('/:cardId/likes', putLikes);
cardsRouter.delete('/:cardId/likes', deleteLikes);
export default cardsRouter;
