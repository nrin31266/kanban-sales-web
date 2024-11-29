/** @format */

import handleAPI from "@/apis/handleAPI";
import HeaderComponent from "@/components/HeaderComponent";
import { API } from "@/configurations/configurations";
import { AuthModel } from "@/model/AuthenticationModel";
import { UserProfile } from "@/model/UserModel";
import AccountLayout from "@/pages/account/AccountLayout";
import { addAuth, authSelector } from "@/reducx/reducers/authReducer";
import { addAllProduct } from "@/reducx/reducers/cartReducer";
import { addUserProfile } from "@/reducx/reducers/profileReducer";
import { Layout, Spin } from "antd";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { localDataNames } from "../constants/appInfos";
import FooterComponent from "@/components/FooterComponent";

const { Content, Footer, Sider } = Layout;

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
        authData.userInfo && getCarts();
      }
    }

    const userProfileInLocal: string | null =
      localStorage.getItem("userProfile");
    if (userProfileInLocal) {
      let data: UserProfile = JSON.parse(userProfileInLocal);
      if (data) {
        dispatch(addUserProfile(data));
      }
    }

    console.log(path);
  }, []);

  const getCarts = async () => {
    try {
      const res = await handleAPI(`${API.CARTS}`);
      dispatch(addAllProduct(res.data.result));
    } catch (error) {
      console.error(error);
    }
  };

  return isLoading ? (
    <Spin />
  ) : path && path.includes("/auth") ? ( // Kiểm tra nếu thuộc "/auth"
    <Layout>
      <Content>
        <Component {...pageProps} />
      </Content>
    </Layout>
  ) : path && (path.includes("/account") || path.includes("/orders")) ? ( // Kiểm tra nếu thuộc "/account"
    <Layout>
      <HeaderComponent />
      <AccountLayout>
        <Component {...pageProps} />
      </AccountLayout>
      <FooterComponent/>
    </Layout>
  ) : (
    // Giao diện mặc định
    <Layout>
      <HeaderComponent />
      <Content>
        <Component {...pageProps} />
      </Content>
      <FooterComponent/>
    </Layout>
  );
};

export default Routers;
