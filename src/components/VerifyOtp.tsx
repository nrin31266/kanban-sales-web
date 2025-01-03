import handleAPI from "@/apis/handleAPI";
import { API } from "@/configurations/configurations";
import {
  faArrowLeft,
  faArrowRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";


interface Props {
  onFinish: () => void;
  onClose: () => void;
  onLogin?: (token: string)=> void,
}

const VerifyOtp = (props: Props) => {
  const inpRefs = [
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
  ];
  const [otpValues, setOtpValues] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]); // State lưu trữ giá trị của từng ô
  const [otpCode, setOtpCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageError, setMessageError] = useState("");
  const { onFinish, onClose, onLogin } = props;
  const [timeReSendOtp, setTimeReSendOtp] = useState(30);

  useEffect(() => {
    focusWhenInputNull();
  }, []);



  useEffect(() => {
    const time = setInterval(() => {
      setTimeReSendOtp((times) => times - 1);
    }, 1000);
    console.log("a");
    return () => clearInterval(time);
  }, []);

  useEffect(() => {
    if (otpCode.length === 6) {
      handleOtpVerify();
    }
  }, [otpCode]);

  const handleBack = () => {
    onClose();
  };
  const focusWhenInputNull = () => {
    for (let index = 0; index < otpValues.length; index++) {
      if (otpValues[index] === "") {
        console.log("Focus vào ô rỗng ở chỉ số:", index);
        inpRefs[index].current.focus();
        return;
      }
    }
  };
  const handleOtpVerify = async () => {
    console.log("verify");
    setIsLoading(true);
    try {
      if(onLogin){
        const userId = sessionStorage.getItem("userId");
        const res = await handleAPI(API.LOGIN_OTP, {otp: otpCode, userId: userId}, 'post');
        console.log(res.data)
        onLogin(res.data.result.token);
        onClose();
      }
    } catch (error: any) {
      console.log(error);
      setMessageError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // join convert array to string | '' <-
    setOtpCode(newOtpValues.join(""));

    if (value && index < 5) {
      inpRefs[index + 1].current.focus();
    }
  };

  const handleReSendOtp = async () => {
    console.log("re send");
    const userId = sessionStorage.getItem("userId");
    setIsLoading(true);
    try {
      await handleAPI(`${API.CREATE_OTP}/${userId}`, undefined, "post");
      setTimeReSendOtp(30);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0 && !e.currentTarget.value) {
      inpRefs[index - 1].current.focus();
    }
  };

  return (
    <div>
      <Button
        type="text"
        onClick={handleBack}
        icon={
          <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#74C0FC" }} />
        }
      >
        Back
      </Button>
      <Typography.Title>Enter OTP</Typography.Title>
      <Typography.Title level={4} type="secondary">
        We have shared a code to your registered email address
        robertfox@example.com
      </Typography.Title>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {inpRefs.map((ref, index) => (
          <Input
            value={otpValues[index]}
            key={index}
            size="large"
            ref={ref}
            maxLength={1}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              width: "calc((100% - 90px) / 6)",
              textAlign: "center",
            }}
          />
        ))}
      </div>
      {messageError !== "" && (
        <div>
          <h3 style={{ color: "red" }}>{messageError}</h3>
        </div>
      )}
      <div className="mt-4">
        <Button
          disabled={otpCode.length < 6}
          loading={isLoading}
          style={{ width: "100%" }}
          type="primary"
          size="large"
          onClick={focusWhenInputNull}
        >
          Verify
        </Button>
      </div>
      <div
        className="mt-2 d-flex"
        style={{
          justifyContent: "center",
        }}
      >
        {timeReSendOtp < 0 ? (
          <Button
            disabled={isLoading}
            type="text"
            size="large"
            onClick={() => handleReSendOtp()}
          >
            <FontAwesomeIcon
              icon={faArrowRotateLeft}
              style={{ color: "#74C0FC" }}
            />
            Re-send OTP
          </Button>
        ) : (
          <div>
            <Typography.Title level={5}>
              You can re send email after{" "}
              <span style={{ color: "red" }}>{timeReSendOtp}</span>s
            </Typography.Title>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
