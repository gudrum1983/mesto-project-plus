import mongoose, { Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';

const bcrypt = require('bcrypt');

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) =>
    Promise<mongoose.Document<unknown, any, IUser>>
}

export const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: 2,
      maxlength: 200,
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
  // Если нужно сохранять время создания и изменения, то можно добавить timestamps
  // {versionKey: false, timestamps: true}
);

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error('Неправильные почта или пароль');
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    throw new Error('Неправильные почта или пароль');
  }

  return user; // теперь user доступен
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
