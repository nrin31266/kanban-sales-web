import handleAPI from "@/apis/handleAPI";
import LeftHalfPanel from "@/components/LeftHalfPanel";
import SocialLogin from "@/components/SocialLogin";
import VerifyOtp from "@/components/VerifyOtp";
import { API, PAGE } from "@/configurations/configurations";
import { ApiResponse } from "@/model/AppModel";
import {
  AuthModel,
  LoginRequest,
  LoginResponse,
} from "@/model/AuthenticationModel";
import { CreateUserRequest, UserInfoResponse } from "@/model/UserModel";
import { addAuth } from "@/reducx/reducers/authReducer";
import {
  Button,
  Checkbox,
  Form,
  Input,
  message,
  notification,
  Typography,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { NotificationPlacement } from "antd/es/notification/interface";
import Link from "antd/es/typography/Link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Register = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [isAgreeToTheTerms, setIsAgreeToTheTerms] = useState<boolean>(false);
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<LoginRequest>();
  const [apiNotification, contextHolder] = notification.useNotification();
  const [isCreated, setIsCreated] = useState(false);

  const dispatch = useDispatch();

  const openNotification = (placement: NotificationPlacement) => {
    apiNotification.warning({
      message: `Terms`,
      description: "To create an account, you need to agree to our terms",
      placement,
    });
  };

  useEffect(() => {
    if (isRegister) {
      handleLogin();
    }
  }, [isRegister]);
  const handleLogin = async () => {
    if (!loginData) {
      message.error("Login error");
      return;
    }
    const api = `${API.LOGIN}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api, loginData, "post");
      const response: ApiResponse<LoginResponse> = res.data;
      const accessToken= response.result.token;
      const auth: AuthModel = { accessToken: accessToken };
      dispatch(addAuth(auth));
      // message.success("Register successfully");
      getUserInfo(accessToken);
      setIsCreated(true);
    } catch (error: any) {
      message.error(error.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInfo = async (accessToken : string) => {
    setIsLoading(true);
    try {
      //Gọi api gì đó
      const res = await handleAPI(API.USER_INFO);
      const response: ApiResponse<UserInfoResponse> = res.data;
      dispatch(addAuth({accessToken: accessToken, userInfo: response.result}));
      
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (values: CreateUserRequest) => {
    console.log(values);
    if (values.password.length < 8) {
      message.error("Pass can not less than 8 character");
      return;
    }
    if (!isAgreeToTheTerms) {
      openNotification("top");
      return;
    }
    const api = `${API.REGISTER}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api, values, "post");
      const response: ApiResponse = res.data;
      console.log(response);

      setIsRegister(true);
      setLoginData({ email: values.email, password: values.password });
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleFinal = () => {
    router.push(PAGE.HOME);
  };
  return (
    <>
      {contextHolder}
      <div
        className="container-fluid"
        style={{ height: "100vh", backgroundColor: "silver" }}
      >
        <div className="row">
          <div className="d-none d-md-block col-6 p-0">
            <LeftHalfPanel />
          </div>
          <div className=" col-md-6 col-sm-12">
            <div
              className="container bg-white d-flex"
              style={{ alignItems: "center", height: "100vh" }}
            >
              <div className="col-sm-12 col-md-12 col-lg-8 offset-lg-2">
                {isCreated ? (
                  <VerifyOtp
                    onClose={() => setIsCreated(false)}
                    onFinish={() => handleFinal()}
                  />
                ) : (
                  <>
                    <div className="mb-4">
                      <Typography.Title>Create new account</Typography.Title>
                      <Typography.Title type="secondary" level={5}>
                        Please enter detail information
                      </Typography.Title>
                    </div>
                    <Form
                      disabled={isLoading}
                      form={form}
                      layout="vertical"
                      onFinish={handleRegister}
                      size="large"
                    >
                      <Form.Item
                        name={"name"}
                        label={"Name"}
                        required={true}
                        rules={[
                          { message: "Please enter name", required: true },
                        ]}
                      >
                        <Input placeholder="Ronaldo" allowClear />
                      </Form.Item>
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
                        />
                      </Form.Item>
                    </Form>
                    <div>
                      <Checkbox
                        checked={isAgreeToTheTerms}
                        onChange={(val) =>
                          setIsAgreeToTheTerms(val.target.checked)
                        }
                      >
                        Agree to our<Link href=""> Terms</Link>
                      </Checkbox>
                    </div>
                    <div className="mt-2">
                      <Button
                        loading={isLoading}
                        size="large"
                        style={{ width: "100%" }}
                        type="primary"
                        onClick={form.submit}
                      >
                        Create
                      </Button>
                    </div>
                    <div className="mt-3">
                      <SocialLogin />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
