import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Empty,
  Layout,
  List,
  Menu,
  Pagination,
  Skeleton,
  Space,
  Spin,
  Typography,
} from "antd";
import { usePathname, useSearchParams } from "next/navigation";
import { API } from "@/configurations/configurations";
import handleAPI from "@/apis/handleAPI";
import { ProductResponse } from "@/model/ProductModel";
import { PageResponse } from "@/model/AppModel";
import { LoadingOutlined } from "@ant-design/icons";
import ProductItem from "@/components/ProductItem";
import { SelectModelHasChildren } from "@/model/FormModel";
import { CategoryResponse } from "@/model/CategoryModel";
import { IoIosClose } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/router";

const ShopPage = () => {
  const { Sider, Content } = Layout;
  const params = useSearchParams();
  const [api, setApi] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [pageData, setPageData] = useState<PageResponse<ProductResponse>>();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const pageRef = useRef(1);
  const categoryIds = params.get("categoryIds");
  const [filterValues, setFilterValues] = useState<{
    categoryIds: string[];
  }>({
    categoryIds: [],
  });

  useEffect(() => {
    getData();
  }, []);


  useEffect(() => {
    setFilterValues((prev) => ({
      ...prev,
      categoryIds: categoryIds ? categoryIds.split(",") : [],
    }));
  }, [categoryIds]);

  const getData = async () => {
    try {
      await getCategories();
    } catch (error) {
      console.log(error);
    }
  };
  const getCategories = async () => {
    const res = await handleAPI(API.CATEGORIES);
    setCategories(res.data.result);
  };

  

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
      const url =
        api === API.PRODUCTS
          ? `${api}?page=${pageRef.current}`
          : `${api}&page=${pageRef.current}`;
      console.log(api);
      const res = await handleAPI(url);
      console.log(res.data);
      setPageData(res.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelectCategory = (id: string) => {
    const updatedFilter = { ...filterValues };

    // Thêm hoặc xóa ID khỏi danh sách
    const index = updatedFilter.categoryIds.indexOf(id);
    if (index === -1) {
      updatedFilter.categoryIds.push(id);
    } else {
      updatedFilter.categoryIds.splice(index, 1);
    }

    setFilterValues(updatedFilter);

    // Gọi hàm updateSearchParams
    updateSearchParams(
      "categoryIds",
      updatedFilter.categoryIds.length > 0 ? updatedFilter.categoryIds : null,
      params,
      pathname,
      router
    );
  };

  const updateSearchParams = (
    key: string,
    value: string | string[] | null,
    params: URLSearchParams,
    pathname: string,
    router: any
  ) => {
    const updatedParams = new URLSearchParams(params.toString());

    if (value === null || (Array.isArray(value) && value.length === 0)) {
      updatedParams.delete(key); // Xóa key nếu value là null hoặc rỗng
    } else if (Array.isArray(value)) {
      updatedParams.set(key, value.join(",")); // Nếu value là array, nối thành chuỗi
    } else {
      updatedParams.set(key, value); // Nếu value là string
    }

    // Cập nhật URL mà không reload
    router.push(`${pathname}?${updatedParams.toString()}`, undefined, {
      shallow: true,
    });
  };

  return (
    <div className="container">
      <Layout>
        <div className="d-none d-md-block">
          <Sider className="mr-2" theme="light">
            <Typography.Title level={5}>SEARCH FILTER</Typography.Title>
            <div>
              <Typography.Title level={5}>Categories</Typography.Title>
              {filterValues?.categoryIds &&
                filterValues.categoryIds.length > 0 && (
                  <div
                    style={{
                      padding: 4,
                      border: "1px solid black",
                      borderRadius: 8,
                    }}
                    className="mb-2"
                  >
                    {filterValues.categoryIds.map((id) => {
                      const category = categories.find(
                        (item) => item.id === id
                      );
                      return (
                        <Space
                          key={`select-${id}`}
                          style={{
                            background: "#F1EFEF",
                            padding: "2px 6px",
                            borderRadius: 6,
                            marginRight: 3,
                            marginBottom: 3,
                          }}
                        >
                          <div style={{ fontWeight: "bold" }}>
                            {category?.name}
                          </div>
                          <a
                            onClick={() => {
                              handleSelectCategory(id);
                            }}
                          >
                            <MdClose size={15} />
                          </a>
                        </Space>
                      );
                    })}
                  </div>
                )}
              <div
                className=""
                style={{
                  maxHeight: 300,
                  overflowY: "auto",
                  border: "1px solid silver",
                  padding: 6,
                }}
              >
                {categories &&
                  categories.map((item) => (
                    <div key={item.id}>
                      <Checkbox
                        style={{}}
                        checked={filterValues?.categoryIds.includes(item.id)}
                        onChange={() => handleSelectCategory(item.id)}
                      >
                        {item.name}
                      </Checkbox>
                    </div>
                  ))}
              </div>
            </div>
          </Sider>
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
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              />
            </div>
          ) : pageData ? (
            pageData.data.length === 0 ? (
              <Empty />
            ) : (
              <div>
                <div className="row m-0">
                  {pageData.data.map((item) => (
                    <ProductItem product={item} key={item.id} />
                  ))}
                </div>
                <div className="mt-4">
                  <Pagination
                    defaultCurrent={pageData.currentPage}
                    total={pageData.totalElements}
                    align="end"
                    onChange={async (v) => {
                      pageRef.current = v;
                      await getProducts();
                    }}
                  />
                </div>
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
