import { ObjectId } from 'mongodb';

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: string | ObjectId
      }
    }
  }
}
