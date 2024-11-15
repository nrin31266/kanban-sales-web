/** @format */

import HeaderComponent from "@/components/HeaderComponent";
import { AuthModel } from "@/model/AuthenticationModel";
import { addAuth, authSelector } from "@/reducx/reducers/authReducer";
import { Layout, Spin } from "antd";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { localDataNames } from "../constants/appInfos";
import handleAPI from "@/apis/handleAPI";
import { API } from "@/configurations/configurations";
import { addAllProduct } from "@/reducx/reducers/cartReducer";

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
    
    if (authInLocal) {
      let authData: AuthModel = JSON.parse(authInLocal);
      if (authData.accessToken) {
        dispatch(addAuth(authData));
        authData.userInfo && getCarts(authData.userInfo.id);
      }
    }

    
    console.log(path);
  }, []);


  const getCarts = async (createdBy: string)=>{
    try {
      const res = await handleAPI(`${API.CARTS}/${createdBy}`);
      dispatch(addAllProduct(res.data.result));
    } catch (error) {
      console.error(error);
    }
  };

  return isLoading ? (
    <Spin />
  ) : path && path.includes("/auth") ? (
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
