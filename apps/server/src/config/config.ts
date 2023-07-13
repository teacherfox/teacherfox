export const AUTH_SECRET = process.env.AUTH_SECRET ?? 'this is my secret';
export const PORT = Number(process.env.PORT ?? 4000);

export enum Environment {
    production = 'prod',
    development = 'development',
    staging = 'staging',
}

export const MODE = process.env.MODE ?? Environment.development;
