import { colors } from "@/constants/appInfos";
import RatingModal from "@/modal/RatingModal";
import { OrderProductResponse, OrderResponse } from "@/model/PaymentModel";
import { FormatCurrency } from "@/utils/formatNumber";
import { Avatar, Space, List, Typography, Button } from "antd";
import React, { useState } from "react";

interface Props {
  data: OrderResponse;
}

const OrderList = (props: Props) => {
  const { data } = props;
  const [isRatingModal, setIsRatingModal] = useState(false);
  const [orderProductSelected, setOrderProductSelected] =
    useState<OrderProductResponse>();

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={data.orderProductResponses}
        renderItem={(item, index) => (
          <List.Item
            key={item.id}
            style={{
              borderBottom: "1px solid #f0f0f0",
              padding: "16px 0",
            }}
            extra={
              <>
                {data.isComplete && (
                  <div>
                    {item.isRating ? (
                      <Button>{"View rating"}</Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setIsRatingModal(true);
                          setOrderProductSelected(item);
                        }}
                        className="btn-warning"
                      >
                        {"Rating now"}
                      </Button>
                    )}
                  </div>
                )}
              </>
            }
          >
            <List.Item.Meta
              avatar={<Avatar shape="square" size={70} src={item.imageUrl} />}
              title={<Typography.Text strong>{item.name}</Typography.Text>}
              description={
                <div>
                  <Space direction="vertical">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {item.options &&
                        Object.keys(item.options).length > 0 &&
                        Object.entries(item.options).map(([key, value]) => (
                          <div key={`${key}-${value}`}>
                            <div
                              className="mr-1"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {key}:&nbsp;
                              <span style={{ opacity: 0.7 }}>
                                {key === "Color" ? (
                                  <div
                                    style={{
                                      display: "inline-block",
                                      backgroundColor: value,
                                      width: 20,
                                      height: 20,
                                      borderRadius: "8%",
                                    }}
                                  ></div>
                                ) : (
                                  value
                                )}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div>
                      <Typography.Text>
                        {FormatCurrency.VND.format(item.price)}
                      </Typography.Text>{" "}
                      x{item.count} ={" "}
                      <Typography.Text strong>
                        {FormatCurrency.VND.format(item.price * item.count)}
                      </Typography.Text>
                    </div>
                  </Space>
                </div>
              }
            />
          </List.Item>
        )}
      />
      {data.isComplete && orderProductSelected && (
        <RatingModal
          order={data}
          orderProduct={orderProductSelected}
          visible={isRatingModal}
          onClose={() => {
            setIsRatingModal(false);
          }}
          onFinish={(v) => console.log(v)}
        />
      )}
    </>
  );
};

export default OrderList;
