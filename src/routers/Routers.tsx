/** @format */

import { useDispatch, useSelector } from "react-redux";
import AuthRouter from "./AuthRouter";
import MainRouter from "./MainRouter";
import { useEffect, useState } from "react";
import { localDataNames, Role } from "../constants/appInfos";
import { Layout, Spin } from "antd";
import { AuthModel } from "@/model/AuthenticationModel";
import type { AppProps } from "next/app";
import { addAuth, authSelector } from "@/reducx/reducers/authReducer";
import { usePathname } from "next/navigation";
import HeaderComponent from "@/components/HeaderComponent";
import handleAPI from "@/apis/handleAPI";
import { API } from "@/configurations/configurations";
import { ApiResponse } from "@/model/AppModel";
import { UserInfoResponse } from "@/model/UserModel";

const { Header, Content, Footer } = Layout;

const Routers = ({ Component, pageProps }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const auth: AuthModel = useSelector(authSelector);
  const [isGetUserInfo, setIsGetUserInfo] = useState(false);
  const path = usePathname();
  

  useEffect(() => {
    const authInLocal: string | null = localStorage.getItem(
      localDataNames.authData
    );
    
    console.log(path);

    if (authInLocal) {
      let authData: AuthModel = JSON.parse(authInLocal);
      if (authData.accessToken) {
        dispatch(addAuth(authData));
      }
    }
  }, []);

  return isLoading ? (
    <Spin />
  ) : path && path.includes("auth") ? (
    <Layout>
      <Content>
        <Component {...pageProps} />
      </Content>
    </Layout>
  ) : (
    <Layout>
      <HeaderComponent />
      <Content>
        <Component {...pageProps} />
      </Content>
      <Footer />
    </Layout>
  );
};

export default Routers;
