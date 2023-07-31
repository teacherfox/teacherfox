import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { AUTH_SECRET } from '../config/config.js';

const { hash } = bcryptjs;
const { sign } = jsonwebtoken;

export const createPassword = async (password: string) => await hash(password, 10);

export const createJwt = (userId: string) => sign({ userId }, AUTH_SECRET);

export const passwordsMatch = async (password: string, hashedPassword: string | null) => {
  if (!hashedPassword) {
    return false;
  }
  return await bcryptjs.compare(password, hashedPassword);
};
