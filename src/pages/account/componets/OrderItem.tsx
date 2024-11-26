import { OrderResponse, StatusDetails } from "@/model/PaymentModel";
import { formatDateDMY } from "@/utils/dateTime";
import React from "react";

interface Props {
  item: OrderResponse;
  tabKey: string;
}

const OrderItem = (props: Props) => {
  const { item, tabKey } = props;
  return (
    <div style={{ width: "100%" }}>
      <div className="order-header">
        <div className="row">
          <div className="col">
            <div
              style={{
                background: `rgba(${parseInt(
                  StatusDetails[tabKey].color.slice(1, 3),
                  16
                )}, ${parseInt(
                  StatusDetails[tabKey].color.slice(3, 5),
                  16
                )}, ${parseInt(
                  StatusDetails[tabKey].color.slice(5, 7),
                  16
                )}, 0.1)`,
                border: `1px solid ${StatusDetails[tabKey].color}`, // Giữ nguyên màu viền
                width: "max-content",
                padding: "0 0.3rem",
                borderRadius: "4px", // Tùy chọn, để các góc mềm mại
              }}
            >
              <span>{StatusDetails[tabKey].label}</span>
            </div>
          </div>
          <div className="col text-right">
            <span>{"Created:"}&nbsp;</span>
            <span>{formatDateDMY(item.createdAt)}</span>
          </div>
        </div>
      </div>
      <div className="order-body">

      </div>
      <div className="order-footer"></div>
    </div>
  );
};

export default OrderItem;
