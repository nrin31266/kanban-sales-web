import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import queryString from "query-string";
import { localDataNames } from "../constants/appInfos";
import handleAPI from "./handleAPI";
import { API, APP } from "../configurations/configurations";
import { AuthModel } from "@/model/AuthenticationModel";
import { ApiResponse } from "@/model/AppModel";
import { CustomAxiosResponse } from "@/model/AxiosModel";


export const getAuth = () => {
  const res = localStorage.getItem(localDataNames.authData);
  return res ? JSON.parse(res) : {};
};

const axiosClient = axios.create({
  baseURL: APP.baseURL,
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
  async (config: any) => {
    const authData:AuthModel = getAuth();

    config.headers = {
      Authorization: authData.accessToken
        ? `Bearer ${authData.accessToken}`
        : undefined,
      Accept: "application/json",
      ...config.headers,
    };
    // console.log(config);
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  async (response: CustomAxiosResponse) => {
    if (response.data.code === 1000) {
      return response;
    } else {
      return Promise.reject(response.data);
    }
  },
  async (error: AxiosError) => {
    const { response } = error;
    return Promise.reject(response?.data);
  }
);

export default axiosClient;


