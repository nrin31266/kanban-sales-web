import { API, PAGE } from "@/configurations/configurations";
import { Button, Divider, Empty, Typography } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import OrderStatusTag from "./OrderStatusTag";
import { OrderResponse, PayMethodLabel, Status } from "@/model/PaymentModel";
import { useSearchParams } from "next/navigation";
import OrderTable from "./OrderTable";
import LoadingComponent from "@/components/LoadingComponent";
import handleAPI from "@/apis/handleAPI";
import { FormatCurrency } from "@/utils/formatNumber";
type PaymentKey = keyof typeof PayMethodLabel;

interface Props {
  onClose: () => void;
  id: string;
}

const OrderDetail = (props: Props) => {
  const { onClose, id } = props;
  const params = useSearchParams();
  const [orderId, setOrderId] = useState<string>();
  const [item, setItem] = useState<OrderResponse>();
  const [isLoading, setIsLoading] = useState(false);
  // useEffect(() => {
  //   if(id){

  //   }
  // }, [id]);

  useEffect(() => {
    setOrderId(params.get("id") ?? undefined);
  }, [params]);

  useEffect(() => {
    if (id) {
      getOrderDetail(id);
    }
  }, [id]);

  const getOrderDetail = async (orderId: string) => {
    setIsLoading(true);
    const url = `${API.ORDERS}/${orderId}`;
    try {
      const res = await handleAPI(url);
      setItem(res.data.result);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const renderContent = () => {
    return (
      <>
        {isLoading ? (
          <LoadingComponent />
        ) : item ? (
          <>
            <div>
              <div>
                <Typography.Title level={4}>Delivery address</Typography.Title>
                <div>
                  <span>{item.customerName}</span>
                </div>
                <div>
                  <span>{item.customerEmail}</span>
                </div>
                <div>
                  <span>{item.customerPhone}</span>
                </div>
                <div>
                  <span>{item.customerAddress}</span>
                </div>
              </div>
              <div>
                <Typography.Title level={4}>Payment method</Typography.Title>
                <div>{PayMethodLabel[item.paymentMethod as PaymentKey]}</div>
              </div>
              <Divider />
              <div>
                <Typography.Title level={4}>
                  {item.orderProductResponses.length}
                  {item.orderProductResponses.length > 1 ? " items" : "item"}
                </Typography.Title>
                <OrderTable data={item} />
              </div>
            </div>
          </>
        ) : (
          <Empty />
        )}
      </>
    );
  };

  return (
    <div>
      <div className="row">
        <div className="col">
          <Link href={"/account/orders"}>
            <Button
              onClick={() => {
                onClose();
              }}
            >
              Back
            </Button>
          </Link>
        </div>
        {item && (
          <div
            className="col"
            style={{ display: "flex", justifyContent: "end" }}
          >
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
      {
        item &&
        <div>
        <div className="d-flex" style={{ justifyContent: "end", alignItems: 'center' }}>
          <Typography.Text style={{fontSize: '1.5rem', fontWeight: '500'}}>{'Total:'}&nbsp;</Typography.Text>
          {
            item.reduction &&
            <span style={{fontSize: '1.7rem', opacity: '0.6'}}><del>{FormatCurrency.VND.format(item.reduction + item.amount)}</del></span>
          }
          <span style={{fontSize: '2rem', fontWeight: 'bold'}}>{FormatCurrency.VND.format(item.amount)}</span>
        </div>
      </div>
      }
    </div>
  );
};

export default OrderDetail;
