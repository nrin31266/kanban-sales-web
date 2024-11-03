import { ApiResponse } from "./AppModel";
import {  AxiosResponse } from "axios";

export interface CustomAxiosResponse<T = any>  extends AxiosResponse<ApiResponse<T>>{
    data: ApiResponse<T>;
}

