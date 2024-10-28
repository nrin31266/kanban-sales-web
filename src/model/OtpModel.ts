export interface VerifyOtpRequest{
    otp:string
}

export interface VerifyOtpResponse{
    verified: boolean,
    message: string
}