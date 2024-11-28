import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { API } from "@/configurations/configurations";
import { Button, Card, Divider, Empty, Typography } from "antd";
import { OrderResponse, PayMethodLabel } from "@/model/PaymentModel";
import LoadingComponent from "@/components/LoadingComponent";
import handleAPI from "@/apis/handleAPI";
import { FormatCurrency } from "@/utils/formatNumber";
import OrderStatusTag from "../../componets/OrderStatusTag";
import OrderTable from "../../componets/OrderTable";

type PaymentKey = keyof typeof PayMethodLabel;

const OrderDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchOrderDetail(id as string);
    }
  }, [id]);

  const fetchOrderDetail = async (orderId: string) => {
    setIsLoading(true);
    try {
      const url = `${API.ORDERS}/${orderId}`;
      const res = await handleAPI(url);
      setItem(res.data.result);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingComponent />;
    }

    if (!item) {
      return <Empty description="No order details available" />;
    }

    return (
      <>
        <Typography.Title level={4}>Delivery Address</Typography.Title>
        <div>
          <p>{item.customerName}</p>
          <p>{item.customerEmail}</p>
          <p>{item.customerPhone}</p>
          <p>{item.customerAddress}</p>
        </div>

        <Typography.Title level={4}>Payment Method</Typography.Title>
        <p>{PayMethodLabel[item.paymentMethod as PaymentKey]}</p>

        <Divider />

        <Typography.Title level={4}>
          {item.orderProductResponses.length}{" "}
          {item.orderProductResponses.length > 1 ? "items" : "item"}
        </Typography.Title>
        <OrderTable data={item} />
      </>
    );
  };

  return (
    <Card>
      <div className="row">
        <div className="col">
          <Link href={`/account/orders?status=${item?.status}`}>
            <Button>Back</Button>
          </Link>
        </div>
        {item && (
          <div className="col" style={{ display: "flex", justifyContent: "end" }}>
            <div className="mr-3">
              <Typography.Text>{"ORDER ID: "}</Typography.Text>
              <span>{item.id}</span>
            </div>
            <OrderStatusTag tabKey={item.status} />
          </div>
        )}
      </div>

      <Divider />

      <div className="mt-3">{renderContent()}</div>

      {item && (
        <div>
          <div
            className="d-flex"
            style={{ justifyContent: "end", alignItems: "center" }}
          >
            <Typography.Text style={{ fontSize: "1rem", fontWeight: "500" }}>
              {"Total:"}&nbsp;
            </Typography.Text>
            {item.reduction && (
              <span style={{ fontSize: "1.3rem", opacity: "0.6" }}>
                <del>
                  {FormatCurrency.VND.format(item.reduction + item.amount)}
                </del>
              </span>
            )}
            <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              {FormatCurrency.VND.format(item.amount)}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default OrderDetail;
