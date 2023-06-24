import { AxiosError, AxiosRequestConfig } from "axios";
import api from "./index";

const setUpInterceptor = () => {
  // Add a request interceptor
  api.interceptors.request.use(
    function (config: any) {
      // Do something before request is sent
      let accessToken = localStorage.getItem("access_token");
      let ms_authenticated = localStorage.getItem("ms_authenticated");
      let language = localStorage.getItem("language");
      // if (access_token) {
      //   api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      // }
      if (ms_authenticated) {
        // this configuration is needed only for Microsoft Authenticated user login because it causes issues to the other logged in types
        config.headers = {
          ...config.headers,
          Authorization: `Token ${accessToken}`,
          "Accept-Language": language!,
        };
      }
      config.headers = {
        ...config.headers,
        "Accept-Language": `${language}`,
      };
      return config;
    },
    function (error) {
      // Do something with request error
      // return Promise.reject(error);
    }
  );

  // Add a response interceptor
  // api.interceptors.response.use(
  //   function (response) {
  //     // Any status code that lie within the range of 2xx cause this function to trigger
  //     // Do something with response data
  //     return response;
  //   },
  //   function (error) {
  //     if (error.response) {
  //       if (error.response?.status === 401) {
  //         const { refreshExpiredToken, logout } = useAuthStore.getState();

  //         const url = error.config.url;
  //         if (url == "/api/auth/refresh_token/") {
  //           logout();
  //         }
  //         refreshExpiredToken();
  //       } else {
  //         console.log("api error", error);
  //       }
  //     }
  //     // Any status codes that falls outside the range of 2xx cause this function to trigger
  //     // Do something with response error
  //     console.log("response error", error);

  //     // return Promise.reject(error);
  //   }
  // );
};

export default setUpInterceptor;
