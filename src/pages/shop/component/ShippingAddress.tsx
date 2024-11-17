import AddressComponent from "@/components/AddressComponent";
import { Button } from "antd";
import React, { useState } from "react";

interface Props {
  onOk: (v: any) => void;
}

const ShippingAddress = (props: Props) => {
  const { onOk } = props;
  const [addressSelected, setAddressSelected] = useState<any>();
  return (
    <div>
      <Button onClick={() => onOk(addressSelected)} type="primary" size="large">
        Deliver address
      </Button>
      <div>
        <AddressComponent />
      </div>
    </div>
  );
};

export default ShippingAddress;
