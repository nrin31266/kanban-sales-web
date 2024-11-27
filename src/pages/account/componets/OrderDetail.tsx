import { API, PAGE } from "@/configurations/configurations";
import { Button, Divider, Empty } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import OrderStatusTag from "./OrderStatusTag";
import { OrderResponse, Status } from "@/model/PaymentModel";
import { useSearchParams } from "next/navigation";
import OrderTable from "./OrderTable";
import LoadingComponent from "@/components/LoadingComponent";
import handleAPI from "@/apis/handleAPI";

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

  const getOrderDetail =async (orderId: string) => {
    setIsLoading(true);
    const url = `${API.ORDERS}/${orderId}`
    try {
      const res = await handleAPI(url);
      setItem(res.data.result);
    } catch (error) {
      console.log(error)
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
              <OrderTable data={item.orderProductResponses} />
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
            <OrderStatusTag tabKey={item.status} />
          </div>
        )}
      </div>
      <Divider />
      <div className="mt-3">{renderContent()}</div>
    </div>
  );
};

export default OrderDetail;
