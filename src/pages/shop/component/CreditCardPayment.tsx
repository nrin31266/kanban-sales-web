import { Button, Card, DatePicker, Form, Input, Typography } from "antd";
import React, { useState } from "react";
import { RiShieldKeyholeLine } from "react-icons/ri";

interface Props {
  onPayment: (v: any) => void;
}

const CreditCardPayment = (props: Props) => {
  const { onPayment } = props;
  const [form] = Form.useForm();
  //   const [isEnableContinue, setIsEnableContinue] = useState(false);

  const handleSubmit = (v: any) => {
    console.log(v);
  };

  return (
    <div>
      <div
        className="d-flex p-2 mb-3"
        style={{
          border: "1px solid #2FB264",
          borderRadius: 4,
          backgroundColor: "rgb(47, 178, 100, 0.1)",
        }}
      >
        <div>
          <RiShieldKeyholeLine style={{ color: "#2FB264" }} size={25} />
        </div>
        <div>
          <Typography.Title style={{ marginBottom: 0 }} level={5}>
            Thông tin thẻ của bạn được bảo vệ.
          </Typography.Title>
          <Typography.Text>
            Chúng tôi hợp tác với các đơn vị cung cấp dịch vụ thanh toán uy tín
            để đảm bảo thông tin thẻ của bạn được an toàn và bảo mật tuyệt đối.
            Shopee sẽ không có quyền truy cập vào thông tin thẻ của bạn.
          </Typography.Text>
        </div>
      </div>
      <Card>
        <div>
          <Form
            size="large"
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
          >
            <Form.Item
              rules={[{ required: true }]}
              label={"Card number"}
              name={"cardNumber"}
            >
              <Input />
            </Form.Item>
            <Form.Item
              rules={[{ required: true }]}
              name={"cardName"}
              label="Card name"
            >
              <Input />
            </Form.Item>
            <div className="row">
              <div className="col">
                <Form.Item
                  rules={[{ required: true }]}
                  name={"expiryDate"}
                  label="Expiry Date"
                >
                  <DatePicker
                    placeholder="MM/YY"
                    mode="date"
                    format={"MM/YY"}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div className="col">
                <Form.Item
                  rules={[{ required: true }]}
                  name={"cvv"}
                  label="CVV"
                >
                  <Input.Password maxLength={3} />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
        <div className="mt-2">
          <Button onClick={() => form.submit()} type="primary">
            Add card
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CreditCardPayment;
