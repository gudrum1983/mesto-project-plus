import mongoose, { Schema } from 'mongoose';
import isURL from 'validator/lib/isURL';
import { ERROR_MESSAGE } from '../utils/textErrorType';

interface ICard {
  name: string;
  link: string;
  owner: mongoose.Types.ObjectId;
  likes: Array<mongoose.Types.ObjectId>;
  createdAt: Date;

}

export const cardSchema = new Schema<ICard>(
  {
    name: {
      type: String,
      required: [true, ERROR_MESSAGE.nameIsRequired],
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: [true, ERROR_MESSAGE.linkIsRequired],
      validate: {
        validator: (v: string) => isURL(v),
        message: ERROR_MESSAGE.incorrectLinkCard,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, ERROR_MESSAGE.ownerIsRequired],
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: 'user' }],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
  // Если нужно сохранять время создания и изменения, то можно добавить timestamps
  // {versionKey: false, timestamps: true}
);

export default mongoose.model<ICard>('card', cardSchema);
