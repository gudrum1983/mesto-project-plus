import * as jwt from 'jsonwebtoken';
import process from 'process';
import { UserIDJwtPayload } from 'jsonwebtoken';
import { JsonWebToken } from './constants';

const { NODE_ENV = 'dev_test', JWT_SECRET = 'dev_test' } = process.env;
const testSecretKey = 'dev_secret_key';
const sevenDays = '7d';
export type TDecoded = string | jwt.JwtPayload | undefined
export const generateToken = (payload: { id: string }) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : testSecretKey, { expiresIn: sevenDays });
export const verifyToken = (token: string) => <UserIDJwtPayload><unknown>jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : testSecretKey, (err, decoded) => JsonWebToken(err, decoded));
