import { OAuth2Client } from 'google-auth-library';
import process from 'process';
import { logger } from 'logger';
import { readOnlyPrisma } from './builder.js';
import { isTFError, TFError } from './types.js';
import { createJwt } from './contexts/user.js';
import { Prisma } from '../.prisma/index.js';

interface PeopleData {
  resourceName: string;
  etag: string;
  names: Name[];
  photos: Photo[];
  emailAddresses: EmailAddress[];
}

interface Name {
  metadata: NameMetadata;
  displayName: string;
  familyName: string;
  givenName: string;
  displayNameLastFirst: string;
  unstructuredName: string;
}

interface NameMetadata {
  primary: boolean;
  source: NameSource;
  sourcePrimary: boolean;
}

interface NameSource {
  type: string;
  id: string;
}

interface Photo {
  metadata: PhotoMetadata;
  url: string;
}

interface PhotoMetadata {
  primary: boolean;
  source: PhotoSource;
}

interface PhotoSource {
  type: string;
  id: string;
}

interface EmailAddress {
  metadata: EmailMetadata;
  value: string;
}

interface EmailMetadata {
  primary?: boolean;
  verified: boolean;
  source: EmailSource;
  sourcePrimary?: boolean;
}

interface EmailSource {
  type: string;
  id: string;
}

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

interface UserdataType {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

export const generateAuthUrl = (state: string) =>
  client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    state,
  });

const getUserdata = async (code: string) => {
  try {
    const getTokenResponse = await client.getToken(code);
    // Make sure to set the credentials on the OAuth2 client.
    client.setCredentials(getTokenResponse.tokens);
    const url = 'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos';
    const { data } = await client.request<PeopleData>({ url });
    return {
      id: data.resourceName.replace('people/', ''),
      name: data.names.find((name) => name.metadata.primary)?.displayName,
      email: data.emailAddresses.find((email) => email.metadata.primary)?.value,
      photo: data.photos.find((photo) => photo.metadata.primary)?.url,
    } as UserdataType;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : JSON.stringify(e);
    logger.error(`Error retrieving user data: ${errorMessage}`);
    return {
      error: true,
      message: errorMessage,
    } as TFError;
  }
};

export const googleLogin = async (
  code: string,
  query: {
    include?: Prisma.UserInclude | undefined;
    select?: Prisma.UserSelect | undefined;
  },
) => {
  const userdata = await getUserdata(code);
  if (isTFError(userdata)) {
    return userdata;
  }

  const googleUser = await readOnlyPrisma.user.findUnique({
    ...query,
    where: { googleId: userdata.id },
  });

  if (googleUser) {
    return {
      token: createJwt(googleUser.id),
      user: googleUser,
    };
  }

  const emailUser = await readOnlyPrisma.user.findUnique({
    ...query,
    where: { email: userdata.email },
  });

  if (emailUser) {
    return {
      token: createJwt(emailUser.id),
      user: emailUser,
    };
  }

  const user = await readOnlyPrisma.user.create({
    ...query,
    data: {
      name: userdata.name,
      email: userdata.email,
      photo: userdata.photo,
      googleId: userdata.id,
    },
  });
  return {
    token: createJwt(user.id),
    user,
  };
};
