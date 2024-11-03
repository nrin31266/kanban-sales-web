import { AuthModel } from "@/model/AuthenticationModel";
import { Button, Carousel, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Login from "./auth/login";
import handleAPI from "./../apis/handleAPI";
import { API } from "@/configurations/configurations";
import { CustomAxiosResponse } from "@/model/AxiosModel";
import { PageResponse } from "@/model/AppModel";
import { PromotionResponse } from "@/model/PromotionModel";
import { CategoryResponse } from "@/model/CategoryModel";
import { DISCOUNT_TYPE } from "@/constants/appInfos";
import { BsArrowRight } from "react-icons/bs";

const HomePage = () => {
  const [isInitLoading, setIsInitLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [promotions, setPromotions] = useState<PromotionResponse[]>();
  useEffect(() => {
    getInitData();
  }, []);

  const getInitData = async () => {
    setIsInitLoading(true);
    try {
      await getPromotions();
      await getCategories();
    } catch (error) {
      console.error(error);
    }
    setIsInitLoading(false);
  };

  const getPromotions = async () => {
    const res: CustomAxiosResponse<PageResponse<PromotionResponse>> =
      await handleAPI(API.PROMOTIONS);
    setPromotions(res.data.result.data);
  };

  const getCategories = async () => {
    const res: CustomAxiosResponse<PageResponse<CategoryResponse>> =
      await handleAPI(API.CATEGORIES);
  };
  return isInitLoading ? (
    <Spin size="large" />
  ) : (
    <div className="container mt-2">
      {promotions && (
        <div>
          <Carousel autoplay autoplaySpeed={3000} style={{}}>
            {promotions.length > 0 &&
              promotions.map((item, index) => (
                <div key={index}>
                  <div
                    style={{
                      backgroundImage: `url('${item.imageUrl}')`,
                      minHeight: "20vh",
                      width: "100%",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      padding: 10,
                    }}
                  >
                    <Typography.Title
                      style={{
                        textShadow:
                          "-1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000",
                      }}
                      className="text-white"
                      level={3}
                    >
                      UP TO {item.value} {DISCOUNT_TYPE(item.discountType)}
                    </Typography.Title>
                    <Button
                      size="large"
                      iconPosition="end"
                      icon={<BsArrowRight size={20} />}
                      type="primary"
                      onClick={() => console.log("detail")}
                    >
                      shopping now
                    </Button>
                  </div>
                </div>
              ))}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default HomePage;
