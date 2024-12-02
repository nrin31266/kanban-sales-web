import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { ReactNode } from "react";

const LoadingComponent = ({ children }: { children?: ReactNode }) => {
  return (
    <div
      className="d-flex"
      style={{ height: "50vh", justifyContent: "center", alignItems: "center" }}
    >
      <div>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
      <div className="m-3">{children}</div>
    </div>
  );
};

export default LoadingComponent;
