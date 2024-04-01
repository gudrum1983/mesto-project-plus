import mongoose, { Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

export const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 200,
    },
    avatar: {
      type: String,
      required: true,
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

export default mongoose.model<IUser>('user', userSchema);
