export const AUTH_SECRET = process.env.AUTH_SECRET ?? '';
export const AWS_REGION = process.env.AWS_REGION ?? 'eu-central-1';
export const PORT = Number(process.env.PORT ?? 4000);

export enum Environment {
    production = 'prod',
    development = 'dev',
    staging = 'staging',
}

export const MODE = process.env.MODE ?? Environment.development;
