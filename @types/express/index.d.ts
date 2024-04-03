import { UserIDJwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: UserIDJwtPayload
    }
  }
}
