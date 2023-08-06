import bcryptjs from 'bcryptjs';

const { hash } = bcryptjs;

export const createPassword = async (password: string) => await hash(password, 10);

export const passwordsMatch = async (password: string, hashedPassword: string | null) => {
  if (!hashedPassword) {
    return false;
  }
  return await bcryptjs.compare(password, hashedPassword);
};
