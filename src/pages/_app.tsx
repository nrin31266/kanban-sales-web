import "@/styles/globalStyle.css";
import type { AppProps } from "next/app";
import { Button, ConfigProvider, App as AntdApp } from "antd";
import Routers from "@/routers/Routers";
import { Provider } from "react-redux";
import store from "@/reducx/store";
import { colors } from "@/constants/appInfos";

export default function App({ Component, pageProps }: AppProps) {
  

  return (
      <Provider store={store}>
        
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: colors[2],
            },
            components: {},
          }}
        >
          <Routers Component={Component} pageProps={pageProps} />
        </ConfigProvider>
      </Provider>
  );
}
