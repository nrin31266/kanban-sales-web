import { Button, Card, List, Modal, Radio, Typography } from "antd";
import React, { useState } from "react";
import CreditCardPayment from "./CreditCardPayment";

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

interface Props {
  onContinue: (v: any) => void;
}

const PaymentMethod = (props: Props) => {
  const [paymentMethodSelected, setPaymentMethodSelected] = useState("cod");
  const { onContinue } = props;
  const [isVisibleModalPayment, setIsVisibleModalPayment] = useState(false);

  const renderPaymentMethodDetail = () => {
    switch (paymentMethodSelected) {
      case "debit":
        return <CreditCardPayment onPayment={(v)=>{console.log(v)}}/>
    }

    return <div>d</div>;
  };

  const handlePayment = () => {
    if (paymentMethodSelected === "cod") {
      onContinue({ paymentMethodSelected });
    } else {
      setIsVisibleModalPayment(true);
    }
  };

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
        <div>
          <Button type="primary" size="large" onClick={() => handlePayment()}>
            Continue
          </Button>
        </div>
      </Card>
      <Modal
        open={isVisibleModalPayment}
        onClose={() => setIsVisibleModalPayment(false)}
        onCancel={() => setIsVisibleModalPayment(false)}
      >
        <h1>Api payment</h1>
          
      </Modal>
    </div>
  );
};

export default PaymentMethod;
