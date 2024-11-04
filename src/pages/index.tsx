import { AuthModel } from "@/model/AuthenticationModel";
import { Button, Carousel, Space, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Login from "./auth/login";
import handleAPI from "./../apis/handleAPI";
import { API, APP, PAGE } from "@/configurations/configurations";
import { CustomAxiosResponse } from "@/model/AxiosModel";
import { PageResponse } from "@/model/AppModel";
import { PromotionResponse } from "@/model/PromotionModel";
import { CategoryResponse } from "@/model/CategoryModel";
import { DISCOUNT_TYPE } from "@/constants/appInfos";
import { BsArrowRight } from "react-icons/bs";
import axios from "axios";
import TabBarComponent from "@/components/TabBarComponent";
import Section from "@/components/Section";
import { current } from "@reduxjs/toolkit";
import { BiArrowBack, BiArrowToLeft } from "react-icons/bi";
import { useRouter } from "next/router";

const HomePage = ({
  promotions,
  categories,
}: {
  promotions: PromotionResponse[];
  categories: CategoryResponse[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [numOfColumnsCategories, setNumOfColumnsCategories] = useState(4);
  const [currentCategoriesIndex, setCurrentCategoriesIndex] = useState(0);
  const [displayedCategories, setDisplayedCategories] = useState<
    CategoryResponse[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    console.log(promotions);
    console.log(categories);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const num = width < 577 ? 4 : width < 768 ? 5 : width < 993 ? 6 : 7;
      setNumOfColumnsCategories(num);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", () => {});
  }, []);

  useEffect(() => {
    const maxIndex = Math.max(0, categories.length - numOfColumnsCategories);
    if (currentCategoriesIndex > maxIndex) {
      setCurrentCategoriesIndex(maxIndex);
    } else {
      setDisplayedCategories(
        categories.slice(
          currentCategoriesIndex,
          currentCategoriesIndex + numOfColumnsCategories
        )
      );
    }
  }, [numOfColumnsCategories, currentCategoriesIndex]);

  const handleLeftCategoriesClick = () => {
    setCurrentCategoriesIndex((prevIndex) =>
      Math.max(prevIndex - numOfColumnsCategories, 0)
    );
  };

  const handleRightCategoriesClick = () => {
    setCurrentCategoriesIndex((prevIndex) =>
      Math.min(
        prevIndex + numOfColumnsCategories,
        categories.length - numOfColumnsCategories
      )
    );
  };

  return (
    <div className="mt-2">
      {promotions.length > 0 && (
        <div className="container">
          <Carousel autoplay autoplaySpeed={2000}>
            {promotions.map((item, index) => (
              <div key={index}>
                <div
                  className="promotion-carousel"
                  style={{
                    backgroundImage: `url('${item.imageUrl}')`,
                    width: "100%",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    padding: 10,
                  }}
                >
                  <div style={{ marginTop: "3rem" }}>
                    <Typography.Title
                      style={{
                        textShadow:
                          "-1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000",
                      }}
                      className="text-white"
                      level={3}
                    >
                      up to {item.value} {DISCOUNT_TYPE(item.discountType)}
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
              </div>
            ))}
          </Carousel>
        </div>
      )}
      <Section>
        <TabBarComponent
          title="Categories"
          titleAlign="text-left"
          titleLevel={2}
          titleRight={
            <Space className="mt-2">
              <Button
                size="small"
                type="primary"
                onClick={handleLeftCategoriesClick}
                disabled={currentCategoriesIndex === 0}
              >
                <BiArrowBack size={15} />
              </Button>
              <Button
                size="small"
                type="primary"
                onClick={handleRightCategoriesClick}
                disabled={
                  currentCategoriesIndex >=
                  categories.length - numOfColumnsCategories
                }
              >
                <BsArrowRight size={15} />
              </Button>
            </Space>
          }
        >
          <div className="row categories-list">
            {displayedCategories.map((category, index) => (
              <div key={category.id + index} className="col p-1 category-item">
                <img
                
                onClick={()=>router.push(`${PAGE.FILTER_PRODUCTS}?categoryId=${category.id}`)}
                  src={
                    category.imageUrl ??
                    "https://th.bing.com/th/id/OIP.LDuPjkWofVWM0adJo5hCegHaJw?rs=1&pid=ImgDetMain"
                  }
                />
                <div className="category-item-content">{category.name}</div>
              </div>
            ))}
          </div>
        </TabBarComponent>
      </Section>
    </div>
  );
};

export async function getStaticProps() {
  try {
    const promotionsRes: CustomAxiosResponse<PageResponse<PromotionResponse>> =
      await axios(`${APP.baseURL}${API.PROMOTIONS}?page=1&size=5`);
    const categoriesRes: CustomAxiosResponse<CategoryResponse[]> = await axios(
      `${APP.baseURL}${API.ROOT_CATEGORIES}`
    );

    return {
      props: {
        promotions: promotionsRes.data.result.data,
        categories: categoriesRes.data.result,
      },
    };
  } catch (error) {
    return {
      props: {
        promotions: [],
        categories: [],
      },
    };
  }
}

export default HomePage;
