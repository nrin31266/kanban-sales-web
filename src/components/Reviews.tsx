import handleAPI from "@/apis/handleAPI";
import { API } from "@/configurations/configurations";
import { PageResponse } from "@/model/AppModel";
import { authSelector } from "@/reducx/reducers/authReducer";
import { Avatar, Empty, Form, List, Pagination, Rate, Typography } from "antd";
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
          <div key={`${key}-${value}`}>
            <div
              className="mr-1"
              style={{ display: "flex", alignItems: "center" }}
            >
              {key}:&nbsp;
              <span style={{ opacity: 0.7 }}>
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
          </div>
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
                    <>
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
                          <Typography.Text>
                            {"Buyer feedback: "}
                          </Typography.Text>
                          <Typography.Text>{item.comment}</Typography.Text>
                        </div>
                      )}
                      {item.reply && (
                        <div>
                          <Typography.Text>
                            {"Seller feedback: "}
                          </Typography.Text>
                          <Typography.Text>{item.reply}</Typography.Text>
                        </div>
                      )}
                    </>
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
