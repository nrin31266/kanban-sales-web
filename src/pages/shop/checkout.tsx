import handleAPI from "@/apis/handleAPI";
import { API } from "@/configurations/configurations";
import { CustomAxiosResponse } from "@/model/AxiosModel";
import { CartResponse } from "@/model/CartModel";
import {
  CheckDiscountCodeRequest,
  CheckDiscountCodeResponse,
  PromotionResponse,
} from "@/model/PromotionModel";
import { FormatCurrency } from "@/utils/formatNumber";
import {
  Button,
  Card,
  Divider,
  Input,
  InputRef,
  message,
  Space,
  Typography,
} from "antd";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CartTable from "./component/CartTable";
import { DISCOUNT_TYPE } from "@/constants/appInfos";
import ShippingAddress from "./component/ShippingAddress";

const Checkout = () => {
  const params = useSearchParams();
  const ids = params.get("ids");
  const isInitialLoad = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CartResponse[]>([]);
  const [discountValue, setDiscountValue] = useState(0);
  const [discountCode, setDiscountCode] = useState<string>();
  const [isCheckDiscountLoading, setIsCheckDiscountLoading] = useState(false);
  const inputDiscountRef = useRef<InputRef>(null);
  const [discount, setDiscount] = useState<PromotionResponse>();
  const [checkoutStep, setCheckoutStep] = useState(0);
  

  useEffect(() => {
    if (isInitialLoad.current && ids) {
      getCarts();
      isInitialLoad.current = false;
    }
  }, [ids]);

  const checkDiscountCode = async () => {
    if (!discountCode) return;
    setIsCheckDiscountLoading(true);
    try {
      const req: CheckDiscountCodeRequest = { discountCode: discountCode };
      const res: CustomAxiosResponse<CheckDiscountCodeResponse> =
        await handleAPI(`${API.PROMOTIONS}/check-code`, req, "post");
      const response: CheckDiscountCodeResponse = res.data.result;
      if (response.isValid) {
        message.success(response.message);
        setDiscount(response.promotionResponse);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsCheckDiscountLoading(false);
    }
  };

  const getCarts = async () => {
    setIsLoading(true);
    try {
      const res = await handleAPI(`${API.CARTS}/to-payment?ids=${ids}`);
      setData(res.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (discount) {
      if (discount.discountType === DISCOUNT_TYPE.PERCENTAGE) {
        setDiscountValue((discount.value / 100) * getSubTotal());
      } else {
        setDiscountValue(discount.value);
      }
    }
  }, [discount]);

  const getSubTotal = () => {
    return data.reduce(
      (a, b) =>
        a +
        (b.subProductResponse && b.subProductResponse.discount
          ? b.subProductResponse.discount
          : b.subProductResponse && b.subProductResponse.price
          ? b.subProductResponse.price
          : 0),
      0
    );
  };

  const renderContent =()=>{
    switch (checkoutStep){
      case 1 : 
        return <ShippingAddress onOk={(v)=>{
          console.log(v);
          setCheckoutStep(0);
        }}/>
      default: 
        return <CartTable data={data}/>
    }
  }

  return (
    <div className="container">
      <div>
        <Typography.Title>Checkout</Typography.Title>
        <div className="row">
          <div className="col-sm-12 col-md-8">
            {renderContent()}
          </div>
          <div className="col mt-2">
            <Card
              title={"Sub total"}
              extra={
                <div>
                  <Typography.Title className="m-0" level={4}>
                    {FormatCurrency.VND.format(getSubTotal())}
                  </Typography.Title>
                </div>
              }
            >
              <div>
                <Typography.Text type="secondary">
                  Discount code:{" "}
                </Typography.Text>
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    ref={inputDiscountRef}
                    onChange={(e) => setDiscountCode(e.currentTarget.value)}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="Code"
                  />
                  <Button
                    loading={isCheckDiscountLoading}
                    onClick={checkDiscountCode}
                    disabled={!discountCode}
                    type="primary"
                    size="large"
                  >
                    Apply
                  </Button>
                </Space.Compact>
                <Space
                  className="mt-2"
                  style={{
                    width: "100%",
                    justifyContent: "space-between", 
                    fontWeight: "500",
                  }}
                >
                  {discount && (
                    <>
                      <Typography.Text style={{ fontSize: "1rem" }}>
                        Delivery change:{" "}
                      </Typography.Text>
                      <Typography.Text style={{ fontSize: "1rem" }}>
                        {discount.discountType === DISCOUNT_TYPE.FIXED_AMOUNT
                          ? FormatCurrency.VND.format(discount.value)
                          : discount.value + "%"}
                      </Typography.Text>
                    </>
                  )}
                </Space>
              </div>
              <Divider />
              <div>
                <Space
                  className="mt-2"
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    fontWeight: "500",
                  }}
                >
                  <Typography.Title level={3}>Grand total: </Typography.Title>
                  {!discount ? (
                    <Typography.Title level={3}>
                      {FormatCurrency.VND.format(getSubTotal() - discountValue)}
                    </Typography.Title>
                  ) : (
                    <div>
                      <Typography.Title className="m-0" level={4}>
                        {FormatCurrency.VND.format(
                          getSubTotal() - discountValue
                        )}
                      </Typography.Title>
                      <Typography.Title className="m-0" type="secondary" level={4}>
                        <del>{FormatCurrency.VND.format(getSubTotal())}</del>
                      </Typography.Title>
                    </div>
                  )}
                </Space>
              </div>

              <div className="mt-3">
                <Button onClick={()=>setCheckoutStep(1)} style={{ width: "100%" }} size="large" type="primary">
                  Process to checkout
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
