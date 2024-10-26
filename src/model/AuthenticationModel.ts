import { UserInfo } from "./UserModel";


export interface AuthModel{
    accessToken: string,
    userInfo?: UserInfo,
}

export interface LogoutRequest{
    token: string
}
export interface LoginRequest{
    email: string,
    password: string
}

export interface LoginResponse{
    token: string
}