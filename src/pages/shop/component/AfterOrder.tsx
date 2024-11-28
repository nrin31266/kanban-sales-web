import handleAPI from "@/apis/handleAPI";
import { API, PAGE } from "@/configurations/configurations";
import { colors } from "@/constants/appInfos";
import { addAllProduct } from "@/reducx/reducers/cartReducer";
import { Button, Modal, Typography } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useDispatch } from "react-redux";

interface Props {
  visible: boolean;
  onHandle: () => void;
}

const AfterOrder = (props: Props) => {
  const { onHandle, visible } = props;
  const router = useRouter();

  
  return (
    <Modal
      open={visible}
      closable={false}
      footer={false}
    >
      <div
        style={{ display: "flex", justifyContent: "center" }}
        className="mt-5, mb-4"
      >
        <div>
        <IoIosCheckmarkCircle size={200} style={{color: colors[2]}}/>
        <Typography.Title level={3} style={{ color: colors[3] }}>
          Order successfully
        </Typography.Title>
        </div>
      </div>
      <Button
        onClick={ () => {
          router.push("/orders")
        }}
        style={{ width: "100%" }}
        size="large"
      >
        View ordered
      </Button>
      <Button
        onClick={ () => {
          router.push(`${PAGE.HOME}`)
        }}
        className="mt-3"
        type="primary"
        style={{ width: "100%" }}
        size="large"
      >
        Back to home
      </Button>
    </Modal>
  );
};

export default AfterOrder;
