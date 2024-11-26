import handleAPI from "@/apis/handleAPI";
import { API } from "@/configurations/configurations";
import { colors } from "@/constants/appInfos";
import { OrderResponse, Status, StatusDetails } from "@/model/PaymentModel";
import { formatDateDMY } from "@/utils/dateTime";
import { FormatCurrency } from "@/utils/formatNumber";
import { Button, Card, Divider, message, Typography } from "antd";
import React, { useState } from "react";
import { FaBox } from "react-icons/fa";

interface Props {
  item: OrderResponse;
  tabKey: string;
  onUpdateStatus: (orderId: string) => void;
}

const OrderItem = (props: Props) => {
  const { item, tabKey, onUpdateStatus } = props;
  const [isLoading, setIsLoading] = useState(false);

  const updateOrderStatus = async (status: string, orderId: string) => {
    const api = `${API.ORDERS}/status/${status}/${orderId}`;
    setIsLoading(true);
    try {
      await handleAPI(api, undefined, "put");
      message.success("Ok");
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="order-item" style={{ width: "100%" }}>
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
          <div  className="col d-flex" style={{ justifyContent: "end" }}>
            <div className="m-1">
              <span>{"Created:"}&nbsp;</span>
              <span style={{ fontWeight: "500" }}>{item.created}</span>
            </div>
            {
              item.status !== Status.PENDING 
              && <div className="m-1">
              <span>{"Modified:"}&nbsp;</span>
              <span style={{ fontWeight: "500" }}>{item.updated}</span>
            </div>
            }
          </div>
        </div>
      </div>
      <Divider className="" style={{ margin: "0.5rem 0 " }} />
      <div className="order-body mt-2 mb-2 d-flex row">
        <div
          className="col-2 d-flex"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div className="ml-3">
            <FaBox size={50} color={StatusDetails[tabKey].color} />
            <div>
              <Typography.Text style={{ fontWeight: "bold", fontSize: "1rem" }}>
                {item.orderProductResponses.length}
                {item.orderProductResponses.length > 1 ? " items" : " item"}
              </Typography.Text>
            </div>
          </div>
        </div>
        <div className="col">
          <Typography.Text className="order-body-title">
            {item.orderProductResponses.map((item) => {
              return `${item.name}, `;
            })}
          </Typography.Text>
          <div className="text-right">
            <Typography.Text style={{ fontWeight: "500", fontSize: "1rem" }}>
              {"Total: "}
            </Typography.Text>
            {item.reduction && (
              <Typography.Text
                type="secondary"
                style={{
                  fontSize: "1rem",
                  fontWeight: "500",
                  marginRight: "0.5rem",
                }}
              >
                <del>
                  {FormatCurrency.VND.format(item.amount + item.reduction)}
                </del>
              </Typography.Text>
            )}
            <Typography.Text style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
              {FormatCurrency.VND.format(item.amount)}
            </Typography.Text>
          </div>
        </div>
      </div>
      <Divider className="" style={{ margin: "0.5rem 0 " }} />
      <div className="order-footer d-flex" style={{ justifyContent: "end" }}>
        {(item.status === Status.PENDING ||
          item.status === Status.CONFIRMED) && (
          <Button
            onClick={() => {
              updateOrderStatus(Status.CANCELLED, item.id);
              onUpdateStatus(item.id);
            }}
            disabled={isLoading}
            className="btn-danger mr-2"
          >
            Cancel
          </Button>
        )}
        {/* {item.status === Status.COMPLETED && (
          <Button
            onClick={() => {
              updateOrderStatus(Status.RETURNS, item.id);
              onUpdateStatus(item.id);
            }}
            disabled={isLoading}
            className="btn-danger mr-2"
          >
            Return
          </Button>
        )} */}
        {item.status === Status.COMPLETED && (
          <Button disabled={isLoading} className="btn-warning mr-2">
            Rate now
          </Button>
        )}

        <Button disabled={isLoading}>Detail</Button>
        {item.status === Status.DELIVERED && (
          <Button
            onClick={() => {
              updateOrderStatus(Status.COMPLETED, item.id);
              onUpdateStatus(item.id);
            }}
            disabled={isLoading}
            type="primary"
            className="ml-2"
          >
            Confirm
          </Button>
        )}
      </div>
    </Card>
  );
};

export default OrderItem;
