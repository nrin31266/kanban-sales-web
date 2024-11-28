import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const LoadingComponent = () => {
  return (
    <div className="d-flex" style={{height: '50vh', justifyContent: 'center', alignItems: 'center'}}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    </div>
  );
};

export default LoadingComponent;
