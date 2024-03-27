import { Router } from 'express';
import { createCard, getCards, remoteCard } from '../controllers/cards';

const cardsRouter = Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', remoteCard);

export default cardsRouter;
