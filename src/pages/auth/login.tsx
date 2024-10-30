import handleAPI from "@/apis/handleAPI";
import LeftHalfPanel from "@/components/LeftHalfPanel";
import SocialLogin from "@/components/SocialLogin";
import { API, PAGE } from "@/configurations/configurations";
import { ApiResponse } from "@/model/AppModel";
import { LoginRequest, LoginResponse } from "@/model/AuthenticationModel";
import { addAuth } from "@/reducx/reducers/authReducer";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Input, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AuthModel } from './../../model/AuthenticationModel';

const login = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();
  const handleLogin = async (values: LoginRequest) => {
    setIsLoading(true);
    const api = `${API.LOGIN}`;
    try {
      const res = await handleAPI(api, values, "post");
      const response: ApiResponse<LoginResponse> = res.data;
      const auth: AuthModel = {accessToken: response.result.token};
      dispatch(addAuth(auth));
      router.push(PAGE.HOME);
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="container-flub">
        <div className="row">
          <div className="d-none d-md-block col-6 p-0">
            <LeftHalfPanel />
          </div>
          <div className="col-md-6 col-sm-12">
            <div
              className="container d-flex"
              style={{
                height: "100vh",
                backgroundColor: "white",
                alignItems: "center",
              }}
            >
              <div
                className="col-sm-12 col-md-12 col-lg-8 offset-lg-2"
                style={{backgroundColor: "white" }}
              >
                <Button
                  type="text"
                  onClick={()=> router.push(PAGE.HOME)}
                  icon={
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      style={{ color: "#74C0FC" }}
                    />
                  }
                >
                  Back
                </Button>
                <Typography.Title>Welcome</Typography.Title>
                <Typography.Title level={4} type="secondary">
                  Login here
                </Typography.Title>
                <div>
                  <Form
                    onFinish={handleLogin}
                    disabled={isLoading}
                    form={form}
                    layout="vertical"
                    size="large"
                  >
                    <Form.Item
                      name={"email"}
                      label={"Email"}
                      required={true}
                      rules={[
                        { message: "Please enter email", required: true },
                      ]}
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
                      <Input.Password
                        
                        minLength={8}
                        type="password"
                        placeholder="Enter password"
                        allowClear
                        visibilityToggle={{
                          visible: false
                        }}
                      />
                    </Form.Item>
                  </Form>
                  <div style={{ textAlign: "right" }}>
                    <Typography.Link>Forgot pass word?</Typography.Link>
                  </div>
                </div>
                <div className="mt-3">
                  <Button
                    loading={isLoading}
                    type="primary"
                    size="large"
                    style={{ width: "100%" }}
                    onClick={() => form.submit()}
                  >
                    Login
                  </Button>
                </div>
                <div className="mt-3">
                  <SocialLogin />
                </div>

                <div className="mt-3">
                  <Button
                    type="link"
                    size="large"
                    style={{ width: "100%" }}
                    onClick={() => router.push(PAGE.REGISTER)}
                  >
                    Register
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
{
  /* <div className=" col-md-6 col-sm-12">
            <div
              className="container bg-white d-flex"
              style={{ alignItems: "center", height: "100vh" }}
            >
              <div className="col-sm-12 col-md-12 col-lg-8 offset-lg-2"></div> */
}
export default login;
