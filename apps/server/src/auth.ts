import pkg, { JwtPayload } from 'jsonwebtoken';
import { AUTH_SECRET } from './config/config.js';

const { verify } = pkg;

export const authenticateUser = async (request: Request): Promise<string | null> => {
  const header = request.headers.get('authorization');
  if (header !== null) {
    const token = header.split(' ')[1];
    const tokenPayload = verify(token, AUTH_SECRET) as JwtPayload;
    return tokenPayload.userId;
  }

  return null;
};
