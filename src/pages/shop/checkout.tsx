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
  Spin,
  Steps,
  Typography,
} from "antd";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CartTable from "./component/CartTable";
import { DISCOUNT_TYPE } from "@/constants/appInfos";
import ShippingAddress from "./component/ShippingAddress";
import { BiDetail, BiHome, BiHomeAlt } from "react-icons/bi";
import { MdOutlinePayment } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import PaymentMethod from "./component/PaymentMethod";
import { AddressResponse } from "@/model/AddressModel";
import { IoMdArrowRoundBack } from "react-icons/io";
import BeforePlaceOrder from "./component/Reviews";
import { OrderRequest, ProductRequest, Status } from "@/model/PaymentModel";
import { AuthModel } from "@/model/AuthenticationModel";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "@/reducx/reducers/authReducer";
import AfterOrder from "./component/AfterOrder";
import { addAllProduct } from "@/reducx/reducers/cartReducer";
import { LoadingOutlined } from '@ant-design/icons';

interface PaymentDetail {
  address?: AddressResponse;
  paymentMethod?: any;
  data?: CartResponse[];
  discountCode?: string;
}

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
  const [paymentDetail, setPaymentDetail] = useState<PaymentDetail>({});
  const [isPlaceOrder, setIsPlaceOrder] = useState(false);
  const auth: AuthModel = useSelector(authSelector);
  const [isOrdered, setIsOrdered] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isInitialLoad.current && ids) {
      getDataCarts();
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
        setPaymentDetail((p) => ({
          ...p,
          discountCode: response.promotionResponse.code,
        }));
      }
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
      setDiscount(undefined); // Xóa thông tin mã giảm giá
      setPaymentDetail((p) => ({
        ...p,
        discountCode: "", // Xóa mã giảm giá trong giỏ hàng
      }));
      setDiscountValue(0);
    } finally {
      setIsCheckDiscountLoading(false);
    }
  };

  const getDataCarts = async () => {
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
          ? b.subProductResponse.discount * b.count
          : b.subProductResponse && b.subProductResponse.price
          ? b.subProductResponse.price * b.count
          : 0),
      0
    );
  };
  useEffect(() => {
    console.log(paymentDetail);
  }, [paymentDetail]);

  const renderContent = () => {
    switch (checkoutStep) {
      case 1:
        return (
          <ShippingAddress
            onOk={(v) => {
              setPaymentDetail((p) => ({ ...p, address: v }));
              setCheckoutStep(2);
            }}
          />
        );
      case 2:
        return (
          <PaymentMethod
            onContinue={(v) => {
              setCheckoutStep(3);
              setPaymentDetail((p) => ({ ...p, paymentMethod: v }));
            }}
          />
        );
      case 3: {
        return <BeforePlaceOrder paymentDetail={paymentDetail} />;
      }
      default:
        return isLoading ? (
          <div className="text-center">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          </div>
        ) : (
          <CartTable data={data} />
        );
    }
  };

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Tạo hiệu ứng cuộn mượt mà
    });
  }
  function buildOrderRequest(rawData: any): OrderRequest {
    const { data, address, paymentMethod, discountCode } = rawData;

    // Lấy thông tin từ địa chỉ
    const {
      name: customerName,
      phoneNumber: customerPhone,
      address: customerAddress,
    } = address;

    // Chuyển đổi danh sách sản phẩm
    const productRequests: ProductRequest[] = data.map((item: any) => {
      const { title: name, subProductId, productId, imageUrl, count } = item;
      const { discount, price, options } = item.subProductResponse;

      return {
        name,
        subProductId,
        productId,
        price: discount ?? price,
        count,
        options, // Chỉ giữ `options`
        imageUrl,
      };
    });

    // Xây dựng yêu cầu đơn hàng
    return {
      customerAddress: customerAddress,
      customerName: customerName,
      customerPhone: customerPhone,
      paymentMethod: paymentMethod,
      orderProductRequests: productRequests,

      discountCode: discountCode ?? undefined,
      customerEmail: auth.userInfo?.email ?? undefined,
    };
  }

  const handlePlaceOrder = async () => {
    const req: OrderRequest = buildOrderRequest(paymentDetail);
    console.log(req);
    setIsPlaceOrder(true);
    try {
      const res = await handleAPI(API.ORDERS, req, "post");
      console.log(res.data);
      await getCarts();
      setIsOrdered(true);
    } catch (error: any) {
      message.error(error.message);
      console.log(error);
    } finally {
      setIsPlaceOrder(false);
    }
  };

  const getCarts = async () => {
    try {
      const res = await handleAPI(`${API.CARTS}`);
      dispatch(addAllProduct(res.data.result));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div>
        {checkoutStep === 0 ? (
          <Typography.Title>Checkout</Typography.Title>
        ) : (
          <div>
            <Button
              type="link"
              icon={<IoMdArrowRoundBack size={20} />}
              onClick={() => setCheckoutStep((p) => p - 1)}
            >
              Step back
            </Button>
          </div>
        )}

        <div className="row">
          <div className="col-sm-12 col-md-8">
            {checkoutStep != 0 && (
              <div>
                <Steps
                  className="mt-2"
                  current={checkoutStep - 1}
                  labelPlacement="vertical"
                  items={[
                    {
                      title: "Address",
                      icon: (
                        <Button
                          type={checkoutStep === 1 ? "primary" : "text"}
                          icon={<BiHome size={30} />}
                          style={{ padding: "20px" }}
                          onClick={undefined}
                        />
                      ),
                    },
                    {
                      title: "Payment Method",
                      icon: (
                        <Button
                          type={checkoutStep === 2 ? "primary" : "text"}
                          icon={<MdOutlinePayment size={30} />}
                          style={{ padding: "20px" }}
                          onClick={undefined}
                        />
                      ),
                    },
                    {
                      title: "Reviews",
                      icon: (
                        <Button
                          type={checkoutStep === 3 ? "primary" : "text"}
                          icon={<BiDetail size={30} />}
                          style={{ padding: "20px" }}
                          onClick={undefined}
                        />
                      ),
                    },
                  ]}
                ></Steps>
              </div>
            )}
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
                      <Typography.Title
                        className="m-0"
                        type="secondary"
                        level={4}
                      >
                        <del>{FormatCurrency.VND.format(getSubTotal())}</del>
                      </Typography.Title>
                    </div>
                  )}
                </Space>
              </div>

              {(checkoutStep === 0 || checkoutStep === 3) && (
                <div className="mt-3">
                  <Button
                    onClick={() => {
                      if (checkoutStep === 3) {
                        if (
                          paymentDetail.address ||
                          (paymentDetail.data &&
                            paymentDetail.data.length > 0) ||
                          !paymentDetail.paymentMethod
                        ) {
                          handlePlaceOrder();
                        }
                      } else if (checkoutStep === 0) {
                        setCheckoutStep(1);
                        setPaymentDetail((p) => ({ ...p, data: data }));
                      }
                      scrollToTop();
                    }}
                    loading={checkoutStep === 3 && isPlaceOrder}
                    style={{ width: "100%" }}
                    size="large"
                    type="primary"
                  >
                    {checkoutStep === 0 ? "Process to checkout" : "Place order"}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <AfterOrder visible={isOrdered} onHandle={() => {}} />
    </div>
  );
};

export default Checkout;
