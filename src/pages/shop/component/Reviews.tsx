import { AddressResponse } from "@/model/AddressModel";
import { CartResponse } from "@/model/CartModel";
import { PayMethod, PayMethodLabel } from "@/model/PaymentModel";
import { Card, Divider, Typography } from "antd";
import React from "react";
import CartTable from "./CartTable";
interface Props {
  paymentDetail: PaymentDetail;
}

interface PaymentDetail {
  address?: AddressResponse;
  paymentMethod?: (typeof PayMethod)[keyof typeof PayMethod];
  data?: CartResponse[];
  discountCode? : string
}



const BeforePlaceOrder = (props: Props) => {
  const { address, data, paymentMethod } = props.paymentDetail;
  return data && address && paymentMethod ? (
    <div>
      <Card>
        <div>
          <Typography.Title level={5}>Shipping address</Typography.Title>
          <div>
            <span>Name: </span>
            <span>{address.name}</span>
          </div>
          <div>
            <span>Phone: </span>
            <span>{address.phoneNumber}</span>
          </div>
          <div>
            <span>Address: </span>
            <span>{`${address.houseNo ? address.houseNo + ", " : ""}${
              address.ward
            }, ${address.district}, ${address.province}`}</span>
          </div>
        </div>
        <Divider />
        <div>
          <Typography.Title level={5}>Payment method</Typography.Title>
          <div>
            <span>{PayMethodLabel[paymentMethod]}</span>
          </div>
        </div>
        <Divider />
        <div>
        <Typography.Title level={5}>Product detail</Typography.Title>
          <CartTable data={data} />
        </div>
      </Card>
    </div>
  ) : (
    <div>Error</div>
  );
};

export default BeforePlaceOrder;
