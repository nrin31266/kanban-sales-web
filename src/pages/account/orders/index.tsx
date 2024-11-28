import { API } from "@/configurations/configurations";
import { OrderResponse, Status } from "@/model/PaymentModel";
import { Affix, Card, Empty, message, Spin, Tabs, TabsProps } from "antd";
import React, { useEffect, useRef, useState } from "react";

import { LoadingOutlined } from "@ant-design/icons";
import handleAPI from "@/apis/handleAPI";
import OrderItems from "../componets/OrderItems";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import OrderDetail from "../componets/OrderDetail";

const Order = () => {
  const [activeTab, setActiveTab] = useState<string>(Status.PENDING);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();
  const [orderId, setOrderId] = useState<string>();
  const pathname = usePathname();
  const router = useRouter();
  // const isInitLoad = useRef(true);

  useEffect(() => {
    setOrderId(params.get("id") ?? undefined);
    // setActiveTab(params.get("status") ??undefined);
  }, [params]);

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
    // updateSearchParamsValues([
    //   {
    //     key: "status",
    //     value: key,
    //   },
    // ]);
    setActiveTab(key);
  };

  const getOrders = async () => {
    const api = `${API.ORDERS}?status=${activeTab}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      setOrders(res.data.result);
      console.log(res.data);
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
  // useEffect(() => {
  //   getOrders();
  // }, []);

  useEffect(() => {
    if(activeTab){
      getOrders();
    }
  }, [activeTab]);

  const updateSearchParamsValues = (values: { key: string; value: any }[]) => {
    const updatedParams = new URLSearchParams(params.toString());

    // Xử lý mảng values
    if (values && values.length > 0) {
      values.forEach((item) => {
        // Kiểm tra và cập nhật tham số từ mảng values
        if (
          item.value == null ||
          item.value === "" ||
          (Array.isArray(item.value) && item.value.length === 0)
        ) {
          updatedParams.delete(item.key); // Xóa nếu giá trị không hợp lệ
        } else if (Array.isArray(item.value)) {
          updatedParams.set(item.key, item.value.join(",")); // Nếu là mảng, nối các giá trị lại
        } else {
          updatedParams.set(item.key, item.value); // Nếu là giá trị đơn lẻ
        }
      });
    }

    // Cập nhật URL bằng router.push
    router.push(`${pathname}?${updatedParams.toString()}`, undefined, {
      shallow: true, // Cập nhật URL mà không cần reload lại trang
    });
  };

  const renderContent = () => {
    if (orderId) {
      return <OrderDetail onClose={() => setOrderId(undefined)} />;
    } else {
      return (
        <div>
          <Tabs
            type="card"
            defaultActiveKey={activeTab}
            items={items.map((item) => ({
              ...item,
              disabled: isLoading, // Vô hiệu hóa tab nếu đang tải
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
                  tabKey={activeTab?? Status.PENDING}
                />
              ) : (
                <Empty />
              )}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div>
      <Card>{renderContent()}</Card>
    </div>
  );
};

export default Order;
