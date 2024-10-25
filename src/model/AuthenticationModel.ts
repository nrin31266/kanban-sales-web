import { UserInfo } from "./UserModel";


export interface AuthModel{
    accessToken: string,
    userInfo: UserInfo,
}

export interface LogoutRequest{
    token: string
}