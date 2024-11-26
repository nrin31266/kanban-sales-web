import { API } from "@/configurations/configurations";
import { OrderResponse, Status } from "@/model/PaymentModel";
import { Affix, Card, Empty, message, Spin, Tabs, TabsProps } from "antd";
import React, { useEffect, useState } from "react";
import OrderItems from "./componets/OrderItems";
import { LoadingOutlined } from "@ant-design/icons";
import handleAPI from "@/apis/handleAPI";
import { TabsPosition } from "antd/es/tabs";

const Order = () => {
  const [activeTab, setActiveTab] = useState<string>(Status.PENDING);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const items: TabsProps["items"] = [
    {
      key: Status.PENDING,
      label: "Pending",
    },
    {
      key: Status.CONFIRMED,
      label: "Confirmed",
    },
    {
      key: Status.DENY,
      label: "Denied",
    },

    {
      key: Status.SHIPPING,
      label: "Shipping",
    },
    {
      key: Status.DELIVERED,
      label: "Delivered",
    },
    {
      key: Status.COMPLETED,
      label: "Completed",
    },
    {
      key: Status.CANCELLED,
      label: "Cancelled",
    },
    {
      key: Status.RETURNS,
      label: "Returns",
    },
  ];
  const onChange = (key: string) => {
    setActiveTab(key);
  };

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    getOrders();
  }, [activeTab]);

  const getOrders = async () => {
    const api = `${API.ORDERS}?status=${activeTab}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      setOrders(res.data.result);
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = (orderId: string) => {
    const newData = orders.filter((item) => item.id !== orderId);
    setOrders(newData);
  };

  return (
    <div>
      <Card>
        <Tabs
          type="card"
          defaultActiveKey={Status.PENDING}
          items={items}
          onChange={onChange}
        />
        {isLoading ? (
          <div className="text-center">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          </div>
        ) : (
          <div>
            {orders.length > 0 ? (
              <OrderItems
                onUpdateStatus={(orderId) => handleUpdateOrderStatus(orderId)}
                data={orders}
                tabKey={activeTab}
              />
            ) : (
              <Empty />
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Order;
