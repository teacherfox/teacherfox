import { JwtPayload, verify } from 'jsonwebtoken';
import { APP_SECRET } from './config/config.js';

export const authenticateUser = async (request: Request): Promise<string | null> => {
  const header = request.headers.get('authorization');
  if (header !== null) {
    const token = header.split(' ')[1];
    const tokenPayload = verify(token, APP_SECRET) as JwtPayload;
    return tokenPayload.userId;
  }

  return null;
};
