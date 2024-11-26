import { OrderResponse } from "@/model/PaymentModel";
import { List } from "antd";
import React from "react";
import OrderItem from "./OrderItem";

interface Props {
  data: OrderResponse[];
  tabKey: string;
}

const OrderItems = (props: Props) => {
  const { data, tabKey } = props;
  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <OrderItem key={item.id} item={item} tabKey={tabKey}/>
          </List.Item>
        )}
      />
    </div>
  );
};

export default OrderItems;
