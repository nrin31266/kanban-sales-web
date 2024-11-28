import { API } from "@/configurations/configurations";
import { OrderResponse, Status } from "@/model/PaymentModel";
import { Card, Empty, message, Spin, Tabs, TabsProps } from "antd";
import React, { useEffect, useRef, useState } from "react";

import { LoadingOutlined } from "@ant-design/icons";
import handleAPI from "@/apis/handleAPI";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

import { GetServerSideProps } from "next";
import OrderItems from "../componets/OrderItems";
import LoadingComponent from "@/components/LoadingComponent";

const Order = ({ initialStatus }: { initialStatus: string }) => {
  const [activeTab, setActiveTab] = useState<string>(initialStatus); 
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log(initialStatus)
  }, [initialStatus]);

  const items: TabsProps["items"] = [
    { key: Status.PENDING, label: "Pending" },
    { key: Status.CONFIRMED, label: "Confirmed" },
    { key: Status.DENY, label: "Denied" },
    { key: Status.SHIPPING, label: "Shipping" },
    { key: Status.DELIVERED, label: "Delivered" },
    { key: Status.COMPLETED, label: "Completed" },
    { key: Status.CANCELLED, label: "Cancelled" },
    { key: Status.RETURNS, label: "Returns" },
  ];

  const isFetching = useRef(false);

  useEffect(() => {
    getOrders();
  }, [activeTab]);

  const getOrders = async () => {
    if (isFetching.current || !activeTab) return;
    isFetching.current = true;

    const api = `${API.ORDERS}?status=${activeTab}`;

    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      setOrders(res.data.result);
    } catch (error: any) {
      console.error(error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  const onChange = (key: string) => {
    setActiveTab(key);
    router.push(`${pathname}?status=${key}`, undefined, { shallow: true });
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
          activeKey={activeTab}
          items={items.map((item) => ({
            ...item,
            disabled: isLoading,
          }))}
          onChange={onChange}
        />
        {isLoading ? (
          <LoadingComponent/>
        ) : orders.length > 0 ? (
          <OrderItems onUpdateStatus={(v)=>{handleUpdateOrderStatus(v)}} data={orders} tabKey={activeTab} />
        ) : (
          <Empty />
        )}
      </Card>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const initialStatus = query.status || Status.PENDING; 
  return {
    props: {
      initialStatus,
    },
  };
};

export default Order;
