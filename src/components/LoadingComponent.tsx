import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const LoadingComponent = () => {
  return (
    <div className="text-center">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    </div>
  );
};

export default LoadingComponent;
