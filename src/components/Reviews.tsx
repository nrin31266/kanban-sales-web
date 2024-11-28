import handleAPI from "@/apis/handleAPI";
import { API } from "@/configurations/configurations";
import { PageResponse } from "@/model/AppModel";
import { authSelector } from "@/reducx/reducers/authReducer";
import {
  Avatar,
  Empty,
  Form,
  Image,
  List,
  Pagination,
  Rate,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingComponent from "./LoadingComponent";
import { RatingResponse } from "@/model/RatingModel";
import { colors } from "@/constants/appInfos";
import { SubProductResponse } from "@/model/SubProduct";
interface Props {
  productId: string;
  subProducts?: SubProductResponse[];
}

const Reviews = (props: Props) => {
  const { productId, subProducts } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [pageData, setPageData] = useState<PageResponse<RatingResponse>>({
    currentPage: 0,
    data: [],
    pageSize: 0,
    totalElements: 0,
    totalPages: 0,
  });
  console.log(subProducts);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (productId) {
      getRatings();
    }
  }, [productId]);

  const getRatings = async () => {
    setIsLoading(true);
    const url = `${API.RATING}?productId=${productId}&page=${page}`;
    try {
      const res = await handleAPI(url);
      setPageData(res.data.result);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const renderOption = (subId: string) => {
    if (subProducts) {
      const item = subProducts.find((sub) => sub.id === subId);

      if (item && item.options && Object.keys(item.options).length > 0) {
        return Object.entries(item.options).map(([key, value]) => (
          <Space key={`${key}-${value}`}>
            <div
              className="mr-1"
              style={{ display: "flex", alignItems: "center" }}
            >
              {key}:&nbsp;
              <span style={{ opacity: 0.9 }}>
                {key === "Color" ? (
                  <div
                    style={{
                      display: "inline-block",
                      backgroundColor: value as string,
                      width: 20,
                      height: 20,
                      borderRadius: "8%",
                    }}
                  ></div>
                ) : (
                  <Typography.Text>{value as string}</Typography.Text>
                )}
              </span>
            </div>
          </Space>
        ));
      } else {
        return <div>No options available</div>; // Hiển thị khi không có options
      }
    } else {
      return <div>AAAA</div>; // Hiển thị khi subProducts không có dữ liệu
    }
  };

  return (
    <div>
      {isLoading ? (
        <LoadingComponent />
      ) : pageData.data.length > 0 ? (
        <div>
          <List
            dataSource={pageData.data}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar size={40} shape="circle" src={item.avatar ?? ""} />
                  }
                  title={
                    <>
                      <div>{item.name ?? ""}</div>
                      <div>{item.created}</div>
                    </>
                  }
                  description={
                    <div className="mr-1">
                      <div>
                        <Rate
                          disabled
                          style={{ fontSize: "1rem", color: colors[4] }}
                          value={item.rating}
                        />
                      </div>
                      {renderOption(item.subProductId)}
                      {item.comment && (
                        <div>
                          <Typography.Text  style={{fontWeight: '500'}}>
                            {"Buyer feedback: "}
                          </Typography.Text>
                          <Typography.Text>{item.comment}</Typography.Text>
                        </div>
                      )}
                      {item.imageUrls && item.imageUrls.length > 0 && (
                        <div>
                          {item.imageUrls.map((imgUrl) => (
                            <Image
                              key={item.id + imgUrl}
                              src={imgUrl}
                              width={100}
                              height={100}
                            />
                          ))}
                        </div>
                      )}{" "}
                      {item.reply && (
                        <div className="mt-1" style={{border: '1px solid silver', padding: '0.4rem', borderRadius: 6, backgroundColor: 'rgb(206, 206, 206, 0.1)'}}>
                          <Typography.Text  style={{opacity: 0.8, fontWeight: '500'}}>
                            {"Seller feedback: "}
                          </Typography.Text>
                          <Typography.Text style={{opacity: 0.8}}>{item.reply}</Typography.Text>
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      ) : (
        <Empty />
      )}
      <div className="mt-4">
        <Pagination
          defaultCurrent={pageData.currentPage}
          total={pageData.totalElements}
          align="end"
          onChange={async (v) => {
            console.log(v);
          }}
          pageSize={5}
        />
      </div>
    </div>
  );
};

export default Reviews;
