export enum CustomKeyType {
  CLIENT_KEY = "client_key",
  CLIENT_SECRET = "client_secret",
  O19_BASE_URL = "o19_base_url",
  ACCESS_TOKEN = "access_token",
  SECRET_KEY = "secret_key",
}

export enum StatusType {
  SUCCESS = "success",
  ERROR = "error",
}

export type CustomResponse = {
  status: StatusType;
  message: string;
  data?: any;
};
