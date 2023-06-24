import axios, { AxiosInstance } from "axios";
// import { useAuthStore } from "store";

// Set config defaults when creating the instance
const api: AxiosInstance = axios.create();

export const getApiApiBaseUrl = (apiBaseUrl: string) => {
  api.defaults.baseURL = apiBaseUrl;
};

// Alter defaults after instance has been created
export const setApiAuth = (access_token: string) => {
  api.defaults.headers.common["Authorization"] = `Token ${access_token}`;
};

export const removeApiAuth = () => {
  delete api.defaults.headers.common["Authorization"];
};

api.defaults.params = {};

export default api;
