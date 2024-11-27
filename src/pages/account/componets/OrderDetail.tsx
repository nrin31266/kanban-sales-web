import { PAGE } from "@/configurations/configurations";
import { Button } from "antd";
import Link from "next/link";
import React from "react";
import OrderStatusTag from "./OrderStatusTag";
import { Status } from "@/model/PaymentModel";

interface Props {
  onClose: () => void;
}

const OrderDetail = (props: Props) => {
  const { onClose } = props;
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
        <div className="col" style={{ display: "flex", justifyContent: "end" }}>
          <OrderStatusTag tabKey={Status.PENDING} />
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
