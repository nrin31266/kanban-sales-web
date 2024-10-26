
import SocialLogin from "@/components/SocialLogin";
import { CreateUserRequest } from "@/model/UserModel";
import { Button, Checkbox, Form, Input, message, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import Link from "antd/es/typography/Link";
import React, { useState } from "react";

const Register = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [isAgreeToTheTerms, setIsAgreeToTheTerms] = useState<boolean>(false);
  const handleRegister = async (values: CreateUserRequest) => {
    console.log(values);
    if (values.password.length < 8) {
      message.error("Pass can not less than 8 character");
      return;
    }
  };
  return (
    <>
      <div
        className="container-fluid"
        style={{ height: "100vh", backgroundColor: "silver" }}
      >
        <div className="row">
          <div
            className="d-none d-md-block col-6 p-0"
            style={{
              backgroundSize: "cover",
              backgroundImage: 'url("/assets/images/bgtest.jpg")',
              height: "100vh",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className=" col-md-6 col-sm-12">
            <div
              className="container bg-white d-flex"
              style={{ alignItems: "center", height: "100vh" }}
            >
              <div className="col-sm-12 col-md-12 col-lg-8 offset-lg-2">
                <div className="mb-4">
                  <Typography.Title>Create new account</Typography.Title>
                  <Typography.Title type="secondary" level={5}>Please enter detail information</Typography.Title>
                </div>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleRegister}
                  size="large"
                  
                >
                  <Form.Item
                    name={"name"}
                    label={"Name"}
                    required={true}
                    rules={[{ message: "Please enter name", required: true }]}
                  >
                    <Input placeholder="Ronaldo" allowClear />
                  </Form.Item>
                  <Form.Item
                    name={"email"}
                    label={"Email"}
                    required={true}
                    rules={[{ message: "Please enter email", required: true }]}
                  >
                    <Input
                      type="email"
                      placeholder="ronaldo@gmail.com"
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item
                    name={"password"}
                    label={"Password"}
                    rules={[
                      { message: "Please enter password", required: true },
                    ]}
                  >
                    <Input
                      minLength={8}
                      type="password"
                      placeholder="Enter password"
                      allowClear
                    />
                  </Form.Item>
                </Form>
                <div>
                  <Checkbox checked={isAgreeToTheTerms} onChange={val=> setIsAgreeToTheTerms(val.target.checked)}>
                  Agree to our<Link href=""> Terms</Link>
                  </Checkbox>
                </div>
                <div className="mt-2">
                  <Button
                    size="large"
                    style={{ width: "100%" }}
                    type="primary"
                    onClick={form.submit}
                  >
                    Create
                  </Button>
                </div>
                <div className="mt-3">
                  <SocialLogin/>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
