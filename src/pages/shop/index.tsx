import React, { useEffect, useState } from "react";
import { Empty, Layout, Skeleton, Spin } from "antd";
import { useSearchParams } from "next/navigation";
import { API } from "@/configurations/configurations";
import handleAPI from "@/apis/handleAPI";
import { ProductResponse } from "@/model/ProductModel";
import { PageResponse } from "@/model/AppModel";
import { LoadingOutlined } from '@ant-design/icons';

interface Req {
  categoryIds: string | null;
}

const ShopPage = () => {
  const { Sider, Content } = Layout;

  const params = useSearchParams();
  const categoryIds = params.get("categoryIds");
  const [api, setApi] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [pageData, setPageData] = useState<PageResponse<ProductResponse>>();

  const [filterValues, setFilterValues] = useState<{
    categoryIds: string[];
  }>();

  // Cập nhật filterValues khi categoryIds thay đổi
  useEffect(() => {
    setFilterValues((prev) => ({
      ...prev,
      categoryIds: categoryIds ? categoryIds.split(",") : [],
    }));
  }, [categoryIds]);

  // Cập nhật API endpoint khi filterValues thay đổi
  useEffect(() => {
    if (filterValues) {
      // Có thể thêm logic để thay đổi API tùy theo các filter

      let updatedApi = API.PRODUCTS;

      if (filterValues.categoryIds.length > 0) {
        // Ví dụ, có thể thêm categoryIds vào API query params
        updatedApi += `?categoryIds=${filterValues.categoryIds.join(",")}`;
      }

      setApi(updatedApi);
    }
  }, [filterValues]);

  // Gửi request API khi API thay đổi
  useEffect(() => {
    if (api) {
      getProducts();
    }
  }, [api]);

  // Hàm gọi API để lấy sản phẩm
  const getProducts = async () => {
    if (!api) {
      return;
    }
    setIsLoading(true);
    try {
      console.log(api);
      const res = await handleAPI(api);
      console.log(res.data);
      setPageData(res.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Layout>
        <div className="d-none d-md-block">
          <Sider theme="light">sider</Sider>
        </div>

        <Content className="bg-white">
          <div className="d-flex" style={{ justifyContent: "space-between" }}>
            <div>a</div>
            <div className="d-block d-md-none">filter</div>
          </div>
          <div className="d-flex" style={{ justifyContent: "space-between" }}>
            <div>c</div>
            <div>d</div>
          </div>
          {isLoading ? (
            <div className="text-center">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            </div>
          ) : pageData ? (
            pageData.data.length === 0 ? (
              <Empty />
            ) : (
              <div>
                <h1>fafafa</h1>
              </div>
            )
          ) : (
            <div>Lỗi khi tải dữ liệu</div>
          )}
        </Content>
      </Layout>
    </div>
  );
};

export default ShopPage;
