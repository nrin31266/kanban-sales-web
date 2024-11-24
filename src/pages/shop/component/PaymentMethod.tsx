import { Button, Card, List, Modal, Radio, Typography } from "antd";
import React, { useState } from "react";
import CreditCardPayment from "./CreditCardPayment";
import { PayMethod } from "@/model/PaymentModel";




const methods: { key: string; title: string }[] = [
  {
    key: PayMethod.CASH_ON_DELIVERY, // Sử dụng PaymentMethod.CREDIT_CARD
    title: "Cash on delivery",
  },
  {
    key: PayMethod.PAYPAL, // Sử dụng PaymentMethod.PAYPAL
    title: "Paypal",
  },
  {
    key: "debit",  // Nếu bạn muốn thêm phương thức không có trong PaymentMethod
    title: "Debit/Credit card",
  },
  {
    key: "google-pay",  // Tương tự cho Google Pay
    title: "Google pay",
  },
];

interface Props {
  onContinue: (v: any) => void;
}

const PaymentMethod = (props: Props) => {

  const [paymentMethodSelected, setPaymentMethodSelected] = useState<string>(PayMethod.CASH_ON_DELIVERY);
  const { onContinue } = props;
  const [isVisibleModalPayment, setIsVisibleModalPayment] = useState(false);

  const renderPaymentMethodDetail = () => {
    switch (paymentMethodSelected) {
      case "debit":
        return <CreditCardPayment onPayment={(v)=>{console.log(v)}}/>
    }

    return (
      <div>
        <p>{`Selected Payment Method: ${paymentMethodSelected}`}</p>
      </div>
    );
    
  };

  const handlePayment = () => {
    if (paymentMethodSelected === PayMethod.CASH_ON_DELIVERY) {
      onContinue(paymentMethodSelected);
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
