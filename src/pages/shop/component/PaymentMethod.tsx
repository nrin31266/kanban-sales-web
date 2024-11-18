import { Card, List, Radio, Typography } from "antd";
import React, { useState } from "react";

const methods: { key: string; title: string }[] = [
  {
    key: "cod",
    title: "Cash on delivery",
  },
  {
    key: "debit",
    title: "Debit/Credit card",
  },
  {
    key: "google-pay",
    title: "Google pay",
  },
  {
    key: "paypal",
    title: "Paypal",
  },
];

const renderPaymentMethodDetail = () => {
  return <div>fa</div>;
};

const PaymentMethod = () => {
  const [paymentMethodSelected, setPaymentMethodSelected] = useState("cod");

  return (
    <div>
      <Card>
        <Typography.Title level={4}>{"Payment method select"}</Typography.Title>
        <List
          dataSource={methods}
          renderItem={(item) => (
            <List.Item key={item.key}>
              <List.Item.Meta
                title={
                  <Radio
                    onClick={() => setPaymentMethodSelected(item.key)}
                    checked={item.key === paymentMethodSelected}
                  >
                    {item.title}
                  </Radio>
                }
                description={
                  item.key === paymentMethodSelected &&
                  renderPaymentMethodDetail()
                }
              ></List.Item.Meta>
            </List.Item>
          )}
        />
        <div></div>
      </Card>
    </div>
  );
};

export default PaymentMethod;
