import pkg from 'jsonwebtoken';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import { AUTH_SECRET } from './config/config.js';
import { $Enums } from '../.prisma/index.js';
import RoleEnum = $Enums.RoleEnum;

const { sign } = jsonwebtoken;
const { verify } = pkg;

interface TFJwtPayload extends JwtPayload {
  userId: string;
  roles: RoleEnum[];
}

export const createJwt = (userId: string, roles: RoleEnum[]) => sign({ userId, roles }, AUTH_SECRET, { expiresIn: '30d' });

export const decodeJwt = (request: Request): TFJwtPayload | null => {
  const header = request.headers.get('authorization');
  if (header !== null) {
    const token = header.split(' ')[1];
    return verify(token, AUTH_SECRET) as TFJwtPayload;
  }

  return null;
};
