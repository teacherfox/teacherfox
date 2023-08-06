import { decodeJwt } from './auth.js';
import { YogaInitialContext } from 'graphql-yoga';
import { acceptedLanguage, Language } from './language.js';
import { $Enums } from '../.prisma/index.js';
import RoleEnum = $Enums.RoleEnum;

export type GraphQLContext = {
  currentUserId: undefined | string;
  acceptedLanguage: Language;
  isAdmin: boolean | undefined;
  isTeacher: boolean | undefined;
  isStudent: boolean | undefined;
};

export async function createContext(initialContext: YogaInitialContext): Promise<GraphQLContext> {
  const token = decodeJwt(initialContext.request);
  return {
    currentUserId: token?.userId,
    isAdmin: token?.roles.includes(RoleEnum.ADMIN),
    isTeacher: token?.roles.includes(RoleEnum.TEACHER),
    isStudent: token?.roles.includes(RoleEnum.STUDENT),
    acceptedLanguage: acceptedLanguage(initialContext.request),
  };
}
