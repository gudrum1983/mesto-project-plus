import mongoose, { Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';
import UnauthorizedError from '../errors/unauthorized-error';
import { ERROR_MESSAGE } from '../utils/textErrorType';

const bcrypt = require('bcrypt');

const DEFAULT_NAME = 'Жак-Ив Кусто';
const DEFAULT_ABOUT = 'Исследователь';
const DEFAULT_AVATAR = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) =>
    Promise<mongoose.Document<unknown, any, IUser>>
}

export const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      default: DEFAULT_NAME,
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      default: DEFAULT_ABOUT,
      minlength: 2,
      maxlength: 200,
    },
    avatar: {
      type: String,
      default: DEFAULT_AVATAR,
      validate: {
        validator: (v: string) => {
          // Если avatar равно значению по умолчанию, то считаем его валидным
          if (v === DEFAULT_AVATAR) return true;

          // Проведение валидации URL, если значение отличается от значения по умолчанию
          return isURL(v, {
            protocols: ['http', 'https'], // Требуются протоколы http или https
            require_protocol: true, // URL должен содержать протокол
            require_valid_protocol: true, // Требуется валидный протокол
            require_tld: true, // Требуется наличие доменной зоны (TLD)
          });
        },
        message: ERROR_MESSAGE.incorrectLinkAvatar,
      },
    },
    email: {
      type: String,
      required: [true, ERROR_MESSAGE.emailIsRequired],
      unique: true,
      validate: {
        validator: (v: string) => isEmail(v),
        message: ERROR_MESSAGE.incorrectEmail,
      },
    },
    password: {
      type: String,
      required: [true, ERROR_MESSAGE.passwordIsRequired],
      select: false, // необходимо добавить поле select
    },
  },
  { versionKey: false },
  // Если нужно сохранять время создания и изменения, то можно добавить timestamps
  // {versionKey: false, timestamps: true}
);

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const currentUser: (mongoose.Document<unknown, any, IUser> & Omit<IUser & { _id: mongoose.Types.ObjectId }, never>) | null = await this.findOne({ email }).select('+password');

  if (!currentUser) {
    throw new UnauthorizedError(ERROR_MESSAGE.incorrectEmailPassword);
  }

  const matched = await bcrypt.compare(password, currentUser.password);

  if (!matched) {
    throw new UnauthorizedError(ERROR_MESSAGE.incorrectEmailPassword);
  }

  return currentUser; // теперь currentUser доступен
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
