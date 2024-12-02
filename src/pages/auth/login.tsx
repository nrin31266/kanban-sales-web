import handleAPI from "@/apis/handleAPI";
import LeftHalfPanel from "@/components/LeftHalfPanel";
import Logo from "@/components/Logo";
import SocialLogin from "@/components/SocialLogin";
import { API, PAGE } from "@/configurations/configurations";
import { ApiResponse } from "@/model/AppModel";
import {
  AuthModel,
  LoginRequest,
  LoginResponse,
} from "@/model/AuthenticationModel";
import { UserInfoResponse } from "@/model/UserModel";
import { addAuth, authSelector } from "@/reducx/reducers/authReducer";
import { addUserProfile } from "@/reducx/reducers/profileReducer";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Input, message, Typography } from "antd";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const login = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();
  const searchParam = useSearchParams();
  const productId = searchParam.get("productId");
  const productSlug = searchParam.get("slug");
  const [isLogin, setIsLogin] = useState(false);
  const auth: AuthModel = useSelector(authSelector);


  const handleLogin = async (values: LoginRequest) => {
    setIsLoading(true);
    const api = `${API.LOGIN}`;
    try {
      const resLogin = await handleAPI(api, values, "post");
      console.log(resLogin)
      sessionStorage.setItem("userId", resLogin.data.result);
      sessionStorage.setItem("authType", "login");
      router.push('/auth/authenticate');
    } catch (error:any) {
      console.log(error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <div>
      <Button
        type="text"
        onClick={() => router.push(PAGE.HOME)}
        icon={
          <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#74C0FC" }} />
        }
      >
        Back
      </Button>
      <Typography.Title>Welcome </Typography.Title>
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
              visibilityToggle={{
                visible: false,
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
