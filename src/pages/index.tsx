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
import { BiArrowBack, BiArrowFromLeft, BiArrowToLeft } from "react-icons/bi";
import { useRouter } from "next/router";
import { ProductResponse } from "@/model/ProductModel";
import ProductItem from "@/components/ProductItem";

const HomePage = ({
  promotions,
  categories,
  bestsellerProducts,
}: {
  promotions: PromotionResponse[];
  categories: CategoryResponse[];
  bestsellerProducts: ProductResponse[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [numOfColumnsCategories, setNumOfColumnsCategories] = useState(4);
  const [currentCategoriesIndex, setCurrentCategoriesIndex] = useState(0);
  const [displayedCategories, setDisplayedCategories] = useState<
    CategoryResponse[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    // console.log(promotions);
    // console.log(categories);
    console.log(bestsellerProducts);
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
                  }}
                >
                  <div className="text-right">
                    <Button
                      iconPosition="end"
                      size="small"
                      className="mr-2 mt-2 btn-primary"
                    >
                      Get
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
                  onClick={() =>
                    router.push(
                      `${PAGE.FILTER_PRODUCTS}?categoryId=${category.id}`
                    )
                  }
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
      <Section>
        <TabBarComponent
          title="Our bestseller"
          titleAlign="text-center"
          titleLevel={2}
        >
          <div className="row">
            {bestsellerProducts.map((product) => (
              <ProductItem key={product.id} product={product}/>
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

    const bestsellerProductsRes: CustomAxiosResponse<ProductResponse[]> =
      await axios(`${APP.baseURL}${API.BESTSELLER_PRODUCTS}`);

    return {
      props: {
        promotions: promotionsRes.data.result.data,
        categories: categoriesRes.data.result,
        bestsellerProducts: bestsellerProductsRes.data.result,
      },
    };
  } catch (error) {
    return {
      props: {
        promotions: [],
        categories: [],
        bestsellerProducts: [],
      },
    };
  }
}

export default HomePage;
