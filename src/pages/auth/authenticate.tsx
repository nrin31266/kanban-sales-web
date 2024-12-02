import React, { useEffect, useRef, useState } from "react";
import handleAPI from "@/apis/handleAPI";
import { API, PAGE } from "@/configurations/configurations";
import { ApiResponse } from "@/model/AppModel";
import { AuthModel, LoginResponse } from "@/model/AuthenticationModel";
import { useDispatch, useSelector } from "react-redux";
import { addAuth, authSelector, removeAuth } from "@/reducx/reducers/authReducer";
import { useRouter } from "next/router";
import { UserInfoResponse } from "@/model/UserModel";
import LoadingComponent from "@/components/LoadingComponent";
import { addUserProfile, removeUserProfile } from "@/reducx/reducers/profileReducer";
import { Typography } from "antd";
import VerifyOtp from "@/components/VerifyOtp";

const Authenticate = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>();
  const dispatch = useDispatch();
  const router = useRouter();
  const isInitLoad = useRef(true);
  const auth: AuthModel = useSelector(authSelector);
  const [isVerify, setIsVerify] = useState(false);


  useEffect(() => {
    if (isInitLoad.current) {
      isInitLoad.current = false;
      const authType = sessionStorage.getItem("authType");
      switch (authType) {
        case "login": {
          handleLogin();
          break;
        }
        case "register": {
          handleRegister();
          break;
        }
        case "google": {
          //
          const authCodeRegex = /code=([^&]+)/;
          const isMatch = router.asPath.match(authCodeRegex);
          //

          if (!isMatch) {
            return;
          } else {
            handleLoginWithGoogle(isMatch);
          }
          break;
        }
        default: {
          console.log(authType);
          router.push(PAGE.LOGIN);
        }
      }
    }
  }, []);

  const handleLogin = async () => {
    await handleReSendOtp();
    setIsVerify(true);

  };

  const handleRegister = async()=>{
    setIsVerify(true);
  }

  const handleReSendOtp = async () => {
    console.log("re send");
    const userId = sessionStorage.getItem("userId");
    setIsLoading(true);
    try {
      await handleAPI(`${API.CREATE_OTP}/${userId}`, undefined, "post");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleLoginWithGoogle = async (isMatch: string[]) => {
    const authCode = isMatch[1];
    console.log(authCode);
    const api = `${API.LOGIN_WITH_GOOGLE(authCode)}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api, undefined, "post");
      const response: ApiResponse<LoginResponse> = res.data;
      console.log(response);
      const accessToken = response.result.token;
      dispatch(addAuth({ ...auth, accessToken: accessToken }));
      setIsLogin(true);
    } catch (error) {
      console.log(error);
    }
  };
  const getUserInfo = async () => {
    try {
      const res = await handleAPI(API.USER_INFO);
      const response: ApiResponse<UserInfoResponse> = res.data;
      dispatch(addAuth({ ...auth, userInfo: response.result }));
    } catch (error) {
      console.log(error);
    }
  };

  const getUserProfile = async () => {
    try {
      const res = await handleAPI(`${API.USER_PROFILE}/my-info`);
      dispatch(addUserProfile(res.data.result));
    } catch (error) {
      console.log(error);
    }
  };

  const Verified = async ()=>{
    await getUserInfo();
    await getUserProfile();

    router.push(PAGE.HOME);
  }

  useEffect(() => {
    if(isLogin){
      Verified();
    }
  }, [isLogin]);

  return isVerify ? (
    <>
      <VerifyOtp
        onClose={() => setIsVerify(false)}
        onFinish={() => {}}
        onLogin={async (token)=>{
          dispatch(addAuth({...auth, accessToken: token}));
          setIsLogin(true);
        }}
      />
    </>
  ) : (
    <div>
      <LoadingComponent>
        <Typography.Title level={4}>Wait a moment</Typography.Title>
      </LoadingComponent>
    </div>
  );
};

export default Authenticate;
