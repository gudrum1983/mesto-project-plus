import throwErrorNotFound from '../errors/not-found-error';

export default () => {
  throwErrorNotFound('Данной страницы не существует');
};
