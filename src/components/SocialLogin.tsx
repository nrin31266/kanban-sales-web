import { OAuthConfig } from "@/configurations/configurations";
import { AuthModel } from "@/model/AuthenticationModel";
import { addAuth, authSelector } from "@/reducx/reducers/authReducer";
import { Button, message } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";





const SocialLogin = () => {
  const [isLoading, setIsLoading] =useState(false);
  const dispatch = useDispatch();
  const auth: AuthModel = useSelector(authSelector);
  
  const handleContinueWithGoogle =async () => {
    const callbackUrl = OAuthConfig.redirectUri;
    const authUrl = OAuthConfig.authUri;
    const googleClientId = OAuthConfig.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
        callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;
    dispatch(addAuth({...auth, type: 'google'}));
    sessionStorage.setItem("authType", "google");
    console.log(targetUrl);

    window.location.href = targetUrl;
  };

  return (
    <Button
    
    loading={isLoading}
    onClick={handleContinueWithGoogle}
    style={{
      width: '100%',
      backgroundColor: 'white'
    }}
    size="large"
      icon={
        <img
          width="24"
          height="24"
          src="https://img.icons8.com/color/48/google-logo.png"
          alt="google-logo"
        />
      }
    >Google</Button>
  );
};

export default SocialLogin;
