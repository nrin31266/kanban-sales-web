import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {Button} from 'antd';
import Routers from "@/routers/Routers";
import { Provider } from "react-redux";
import store from "@/reducx/store";

export default function App({ Component, pageProps }: AppProps) {
  return <Provider store={store}>
    <Routers Component={Component} pageProps={pageProps}/>
  </Provider>;
}
