type CustomError =
  | 'incorrectToken'
  | 'incorrectEmailPassword'
  | 'notFoundByIdUser'
  | 'conflictCreateUser'
  | 'notFoundByIdCard'
  | 'forbiddenDeleteCard'
  | 'incorrectLinkAvatar'
  | 'incorrectEmail'
  | 'passwordIsRequired'
  | 'emailIsRequired'
  | 'nameIsRequired'
  | 'notAuth'
  | 'linkIsRequired'
  | 'incorrectLinkCard'
  | 'ownerIsRequired'

type CustomText = 'successDelete'

export const ERROR_MESSAGE: Record<CustomError, string> = {
  incorrectToken: 'С токеном что-то не так',
  notAuth: 'Вы не авторизованы',
  incorrectEmailPassword: 'Email или Password введены некорректно',
  notFoundByIdUser: 'Пользователь с таким ИД не найден',
  conflictCreateUser: 'Пользователь с таким email уже существует.',
  notFoundByIdCard: 'Карточка с таким ИД не найдена ',
  forbiddenDeleteCard: 'Вы не имеете прав на удаление этой карточки.',
  incorrectLinkAvatar: 'Неправильный формат ссылки на картинку аватара',
  passwordIsRequired: 'Поле "password" является обязательным',
  emailIsRequired: 'Поле "email" является обязательным',
  incorrectEmail: 'Неправильный формат почты',
  nameIsRequired: 'Поле "name" является обязательным',
  ownerIsRequired: 'Поле "owner" является обязательным',
  linkIsRequired: 'Поле "link" является обязательным',
  incorrectLinkCard: 'Неправильный формат ссылки на картинку карточки',
};

export const TextCustom: Record<CustomText, string> = { successDelete: 'Карточка успешно удалена' };
