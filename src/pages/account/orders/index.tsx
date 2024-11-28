import { API } from "@/configurations/configurations";
import { OrderResponse, Status } from "@/model/PaymentModel";
import { Card, Empty, message, Spin, Tabs, TabsProps } from "antd";
import React, { useEffect, useRef, useState } from "react";

import { LoadingOutlined } from "@ant-design/icons";
import handleAPI from "@/apis/handleAPI";
import OrderItems from "../componets/OrderItems";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

const Order = () => {
  const [activeTab, setActiveTab] = useState<string>(); // Mặc định là "pending"
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

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
    const status = params.get("status");
    if (status !== activeTab) {
      setActiveTab(status ?? Status.PENDING); // Chỉ cập nhật nếu giá trị khác
    }
  }, [params]);
  
  useEffect(() => {
    if (activeTab) {
      getOrders();
    }
  }, [activeTab]);
  
  const getOrders = async () => {
    if (isFetching.current || !activeTab) return; 
    isFetching.current = true;
  
    let api = `${API.ORDERS}?status=${activeTab}`;
  
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      setOrders(res.data.result);
      console.log(res.data);
    } catch (error: any) {
      console.error(error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };
  

  const onChange = (key: string) => {
    updateSearchParamsValues([{ key: "status", value: key }]);
  };

  const updateSearchParamsValues = (values: { key: string; value: any }[]) => {
    const updatedParams = new URLSearchParams(params.toString());
    values.forEach((item) => {
      if (!item.value) {
        updatedParams.delete(item.key);
      } else {
        updatedParams.set(item.key, item.value);
      }
    });
    router.push(`${pathname}?${updatedParams.toString()}`, undefined, {
      shallow: true,
    });
  };

  const handleUpdateOrderStatus = (orderId: string) => {
    const newData = orders.filter((item) => item.id !== orderId);
    setOrders(newData);
  };

  const renderContent = () => (
    <div>
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
              tabKey={activeTab ?? Status.PENDING}
            />
          ) : (
            <Empty />
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <Card>{renderContent()}</Card>
    </div>
  );
};

export default Order;
