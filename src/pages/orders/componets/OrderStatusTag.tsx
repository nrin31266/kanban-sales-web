import { StatusDetails } from "@/model/PaymentModel";
import React from "react";

interface Props {
  tabKey: string;
}

const OrderStatusTag = (props: Props) => {
  const { tabKey } = props;
  return (
    <div
      style={{
        background: `rgba(${parseInt(
          StatusDetails[tabKey].color.slice(1, 3),
          16
        )}, ${parseInt(
          StatusDetails[tabKey].color.slice(3, 5),
          16
        )}, ${parseInt(StatusDetails[tabKey].color.slice(5, 7), 16)}, 0.1)`,
        border: `1px solid ${StatusDetails[tabKey].color}`, // Giữ nguyên màu viền
        width: "max-content",
        padding: "0 0.3rem",
        borderRadius: "4px", // Tùy chọn, để các góc mềm mại
        height: 'max-content'
      }}
    >
      <span>{StatusDetails[tabKey].label}</span>
    </div>
  );
};

export default OrderStatusTag;
