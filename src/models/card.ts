import mongoose, { Schema } from 'mongoose';

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
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: 'user' }],
      required: true,
      default: [],
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    versionKey: false, timestamps: true,
  },
);

export default mongoose.model<ICard>('card', cardSchema);
