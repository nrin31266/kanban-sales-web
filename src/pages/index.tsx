import { AuthModel } from "@/model/AuthenticationModel";
import { Button, Carousel, Space, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Login from "./auth/login";
import handleAPI from "./../apis/handleAPI";
import { API, APP } from "@/configurations/configurations";
import { CustomAxiosResponse } from "@/model/AxiosModel";
import { PageResponse } from "@/model/AppModel";
import { PromotionResponse } from "@/model/PromotionModel";
import { CategoryResponse } from "@/model/CategoryModel";
import { DISCOUNT_TYPE } from "@/constants/appInfos";
import { BsArrowRight } from "react-icons/bs";
import axios from "axios";
import TabBarComponent from "@/components/TabBarComponent";
import Section from "@/components/Section";

const HomePage = ({ promotions, categories }: { promotions: PromotionResponse[], categories: CategoryResponse[] }) => {
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    console.log(promotions);

    console.log(categories);
  }, []);
  

  return <div className="mt-2">
      {promotions.length > 0 && (
        <div className="container">
          <Carousel autoplay autoplaySpeed={3000}>
            {promotions.map((item, index) => (
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
                  <div style={{marginTop: '3rem'}}>
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
        <TabBarComponent title="Categories" titleAlign="text-left" titleLevel={2} titleRight={<Space><Button>L</Button><Button>R</Button></Space>}/>
      </Section>
      
    </div>
};


export async function getStaticProps() {
  try {
    const promotionsRes: CustomAxiosResponse<PageResponse<PromotionResponse>> = await axios(`${APP.baseURL}${API.PROMOTIONS}?page=1&size=5`);
    const categoriesRes: CustomAxiosResponse<CategoryResponse[]> = await axios(`${APP.baseURL}${API.ROOT_CATEGORIES}`)
    
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
        categories: []
      },
    };
  }
}

export default HomePage;
