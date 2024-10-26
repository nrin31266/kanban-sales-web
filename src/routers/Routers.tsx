/** @format */

import { useDispatch, useSelector } from "react-redux";
import AuthRouter from "./AuthRouter";
import MainRouter from "./MainRouter";
import { useEffect, useState } from "react";
import { localDataNames, Role } from "../constants/appInfos";
import { Layout, Spin } from "antd";
import { AuthModel } from "@/model/AuthenticationModel";
import type { AppProps } from "next/app";
import { authSelector } from "@/reducx/reducers/authReducer";
import { usePathname } from "next/navigation";
import HeaderComponent from "@/components/HeaderComponent";

const { Header, Content, Footer } = Layout;

const Routers = ({ Component, pageProps }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector(authSelector);
  const path = usePathname();
  console.log(path);

  useEffect(() => {
    const fetch = async (authData: AuthModel) => {
      setIsLoading(true);
      try {
        //Gọi api gì đó
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    const authInLocal: string | null = localStorage.getItem(
      localDataNames.authData
    );

    if (authInLocal) {
      let authData: AuthModel = JSON.parse(authInLocal);
      if (authData.accessToken) {
        fetch(authData);
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
