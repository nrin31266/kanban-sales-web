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
import { addAuth, authSelector } from "@/reducx/reducers/authReducer";
import { addUserProfile } from "@/reducx/reducers/profileReducer";
import {
  Button,
  Checkbox,
  Form,
  Input,
  message,
  notification,
  NotificationArgsProps,
  Typography,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { NotificationPlacement } from "antd/es/notification/interface";
import Link from "antd/es/typography/Link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [isAgreeToTheTerms, setIsAgreeToTheTerms] = useState<boolean>(false);
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<LoginRequest>();
  type NotificationPlacement = NotificationArgsProps["placement"];
  const [isCreated, setIsCreated] = useState(false);
  const auth: AuthModel = useSelector(authSelector);
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (placement: NotificationPlacement) => {
    api.warning({
      message: `Terms`,
      description: "To create an account, you need to agree to our terms",
      placement,
    });
  };
  const dispatch = useDispatch();

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
    const apiRe = `${API.REGISTER}`;
    const apiLogin = `${API.LOGIN}`;
    setIsLoading(true);
    try {
      const resR = await handleAPI(apiRe, values, "post");
      console.log(resR);
      const resLogin = await handleAPI(apiLogin, values, "post");
      console.log(resLogin);
      sessionStorage.setItem("userId", resLogin.data.result);
      sessionStorage.setItem("authType", "register");
      router.push("/auth/authenticate");
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
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
          <Input type="email" placeholder="ronaldo@gmail.com" allowClear />
        </Form.Item>
        <Form.Item
          name={"password"}
          label={"Password"}
          rules={[{ message: "Please enter password", required: true }]}
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
          onChange={(val) => setIsAgreeToTheTerms(val.target.checked)}
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
      <div className="mt-3">
        <Button
          style={{ width: "100%" }}
          type="link"
          onClick={() => router.push(PAGE.LOGIN)}
        >
          Go to login
        </Button>
      </div>
    </>
  );
};

export default Register;
