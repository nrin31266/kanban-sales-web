import { Empty, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import handleAPI from "@/apis/handleAPI";
import { API, PAGE } from "@/configurations/configurations";
import { ApiResponse } from "@/model/AppModel";
import {
  AuthModel,
  LoginRequest,
  LoginResponse,
} from "@/model/AuthenticationModel";
import { useDispatch } from "react-redux";
import { addAuth } from "@/reducx/reducers/authReducer";
import { useRouter } from "next/router";

const Authenticate = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);
    if (!isMatch) {
      return;
    } else {
      handleLoginWithGoogle(isMatch);
    }
  }, []);

  useEffect(() => {
    if (isLogin) {
      router.push(PAGE.HOME);
    }
  }, [isLogin]);

  const handleLoginWithGoogle = async (isMatch: string[]) => {
    const authCode = isMatch[1];
    console.log(authCode);
    const api = `${API.LOGIN_WITH_GOOGLE(authCode)}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api, undefined, "post");
      const response: ApiResponse<LoginResponse> = res.data;
      console.log(response);
      const auth = response.result?.token;
      dispatch(addAuth(auth));
      setIsLogin(true);
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading ? (
    <div
      className="d-flex"
      style={{
        justifyContent: "center",
        width: "100%",
        height: "100vh",
        alignItems: "center",
      }}
    >
      <div>
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 48, color: "" }} spin />
          }
        />
      </div>
    </div>
  ) : (
    <Empty
      description={
        <Typography.Title className="text-danger">Error</Typography.Title>
      }
    />
  );
};

export default Authenticate;
