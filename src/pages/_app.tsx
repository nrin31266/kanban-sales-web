import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {Button} from 'antd';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
