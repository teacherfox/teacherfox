export interface TFError {
  error: boolean;
  message: string;
}

export const isTFError = (obj: any): obj is TFError => {
  return obj.error && obj.message !== undefined;
}
