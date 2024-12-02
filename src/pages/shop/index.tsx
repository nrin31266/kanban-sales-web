import handleAPI from "@/apis/handleAPI";
import ProductItem from "@/components/ProductItem";
import { API } from "@/configurations/configurations";
import { colors } from "@/constants/appInfos";
import { PageResponse } from "@/model/AppModel";
import { CategoryResponse } from "@/model/CategoryModel";
import { ProductResponse } from "@/model/ProductModel";
import { FormatCurrency } from "@/utils/formatNumber";
import { LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Empty,
  Form,
  Input,
  Layout,
  Pagination,
  Space,
  Spin,
  Typography
} from "antd";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { MdClose } from "react-icons/md";

// interface Props{ categoryIds: [], page: string, search: string }

const ShopPage = () => {
  const { Sider, Content } = Layout;
  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [pageData, setPageData] = useState<PageResponse<ProductResponse>>({
    data: [],
    currentPage: 0,
    pageSize: 0,
    totalElements: 0,
    totalPages: 0,
  });
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const router = useRouter();
  const [apiUrl, setApiUrl] = useState<string>(""); // lưu URL API đã tạo
  const pathname = usePathname();
  const pageRef = useRef("1");
  const [formPriceRange] = Form.useForm();
  const isInitLoad = useRef(true);
  const [minMaxPrice, setMinMaxPrice] = useState<{
    min: number;
    max: number;
  }>();
  const [filterValues, setFilterValues] = useState<{
    categoryIds: string[];
    min?: number;
    max?: number;
    search?: string;
  }>({
    categoryIds: [],
  });

  // Gọi API lấy dữ liệu ban đầu
  useEffect(() => {
    const getData = async () => {
      try {
        const [categoriesRes, minMaxRes] = await Promise.all([
          handleAPI(API.CATEGORIES),
          handleAPI(`${API.SUB_PRODUCTS}/min-max-price`),
        ]);
        setCategories(categoriesRes.data.result);
        setMinMaxPrice(minMaxRes.data.result);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
    };
    if (isInitLoad.current) {
      getData();
      isInitLoad.current = false;
    }
  }, []); 

  // Hàm tạo URL API
  const createApiUrl = () => {
    const categoryIds = params.get("categoryIds");
    const min = params.get("min");
    const max = params.get("max");
    const page = params.get("page") || "1"; // mặc định trang 1
    const search = params.get("search");

    let url = `${API.PRODUCTS}?page=${page}`;
    if (categoryIds) url += `&categoryIds=${categoryIds}`;
    if (min) url += `&min=${min}`;
    if (max) url += `&max=${max}`;
    if (search) url+= `&search=${search}`

    return url;
  };

  useEffect(() => {
    const categoryIds = params.get("categoryIds")?.split(",") ?? []; 
    const min = params.get("min")
      ? parseFloat(params.get("min") ?? "0")
      : undefined;
    const max = params.get("max")
      ? parseFloat(params.get("max") ?? "0")
      : undefined;
    const page = params.get("page");
    const search = params.get("search");

    setFilterValues({
      categoryIds,
      min,
      max,
      search: search?? undefined,
    });
    if (page) {
      pageRef.current = page;
    }
    console.log("is");
  }, [params]);

  useEffect(() => {
    formPriceRange.setFieldValue("min", filterValues.min ?? "");
    formPriceRange.setFieldValue("max", filterValues.max ?? "");
  }, [filterValues]);

  // Gọi API mỗi khi `params` thay đổi
  useEffect(() => {
    const newApi = createApiUrl();
    if (apiUrl !== newApi) setApiUrl(newApi);
  }, [params]);

  useEffect(() => {
    if (apiUrl) {
      getProducts();
    }
  }, [apiUrl]);

  const getProducts = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await handleAPI(apiUrl);
      console.log(res.data.result);
      setPageData(res.data.result);
    } catch (error) {
      console.error("Failed to fetch products", error);
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
    updateSearchParamsValues([{key: "categoryIds", value: updatedFilter.categoryIds.length > 0 ? updatedFilter.categoryIds : null},
      {key: 'page', value: "1"}
    ]);
  };

  const updateSearchParamsValues = (
    values: { key: string; value: any }[]
  ) => {
    const updatedParams = new URLSearchParams(params.toString());

    // Xử lý mảng values
    if (values && values.length > 0) {
      values.forEach((item) => {
        // Kiểm tra và cập nhật tham số từ mảng values
        if (
          item.value == null ||
          item.value === "" ||
          (Array.isArray(item.value) && item.value.length === 0)
        ) {
          updatedParams.delete(item.key); // Xóa nếu giá trị không hợp lệ
        } else if (Array.isArray(item.value)) {
          updatedParams.set(item.key, item.value.join(",")); // Nếu là mảng, nối các giá trị lại
        } else {
          updatedParams.set(item.key, item.value); // Nếu là giá trị đơn lẻ
        }
      });
    }

    // Cập nhật URL bằng router.push
    router.push(`${pathname}?${updatedParams.toString()}`, undefined, {
      shallow: true, // Cập nhật URL mà không cần reload lại trang
    });
  };

  const updateSearchParamsValue = (key: string, value: any) => {
    const updatedParams = new URLSearchParams(params.toString());

    // Kiểm tra và cập nhật tham số từ key và value đơn
    if (
      value == null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      updatedParams.delete(key); // Xóa nếu giá trị không hợp lệ
    } else if (Array.isArray(value)) {
      updatedParams.set(key, value.join(",")); // Nếu là mảng, nối các giá trị lại
    } else {
      updatedParams.set(key, value); // Nếu là giá trị đơn lẻ
    }

    // Cập nhật URL bằng router.push
    router.push(`${pathname}?${updatedParams.toString()}`, undefined, {
      shallow: true, // Cập nhật URL mà không cần reload lại trang
    });
  };

  const handlePriceRange = (values: any) => {
    console.log("Received values:", values); // Kiểm tra giá trị nhận vào

    const { min, max } = values;

    updateSearchParamsValues([
      { key: "min", value: min ?? null },
      { key: "max", value: max ?? null },
      { key: "page", value: 1 },
    ]);
  };

  return (
    <div className="container">
      <Layout>
        <div className="d-none d-md-block  ">
          <Sider width={300} className="mr-2 p-2" theme="light">
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
            {minMaxPrice && (
              <>
                <Typography.Title className="mt-2" level={5}>
                  Price range
                </Typography.Title>
                <div>
                  <div>
                    <Typography.Text>
                      {FormatCurrency.VND.format(0)}
                      {"- "}
                      {FormatCurrency.VND.format(minMaxPrice.max)}
                    </Typography.Text>
                  </div>
                  <Form
                    form={formPriceRange}
                    onFinish={(v) => handlePriceRange(v)}
                  >
                    <div className="d-flex">
                      <Form.Item
                        name={"min"}
                        rules={[
                          {
                            validator: (_, value) => {
                              if (value == null || value === "") {
                                return Promise.resolve();
                              }
                              if (isNaN(value) || Number(value) < 0) {
                                return Promise.reject(
                                  new Error(
                                    "Number must be greater than or equal to 0!"
                                  )
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input type="number" placeholder="MIN" />
                      </Form.Item>
                      <IoIosArrowForward size={30} />
                      <Form.Item
                        name={"max"}
                        rules={[
                          {
                            validator: (_, value) => {
                              if (value == null || value === "") {
                                return Promise.resolve();
                              }
                              if (isNaN(value) || Number(value) < 0) {
                                return Promise.reject(
                                  new Error(
                                    "Number must be greater than or equal to 0!"
                                  )
                                );
                              }
                              if (
                                formPriceRange.getFieldValue("min") != null &&
                                value <=
                                  Number(formPriceRange.getFieldValue("min"))
                              ) {
                                return Promise.reject(
                                  new Error(
                                    "Max price must be greater than Min price!"
                                  )
                                );
                              }
                              // Kiểm tra nếu "max" không vượt quá minMaxPrice.max (giới hạn tối đa)
                              if (value != null && value > minMaxPrice.max) {
                                return Promise.reject(
                                  new Error(
                                    `Max price cannot exceed ${minMaxPrice.max}`
                                  )
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input type="number" placeholder="MAX" />
                      </Form.Item>
                    </div>
                    <div className="mt-1">
                      <Button
                        disabled={isLoading}
                        onClick={() => formPriceRange.submit()}
                        // htmlType="submit"
                        size="small"
                        style={{ width: "100%", backgroundColor: colors[2] }}
                      >
                        Range
                      </Button>
                    </div>
                  </Form>
                </div>
              </>
            )}
          </Sider>
        </div>

        <Content className="bg-white">
          <div className="ml-2 mr-2">
          <div className="d-flex" style={{ justifyContent: "space-between" }}>
            <div></div>
            <div className="d-block d-md-none"><Button size="small">Filter</Button></div>
          </div>
          <div className="d-flex" style={{ justifyContent: "space-between" }}>
            <div>
              <span>Showing page {pageData.currentPage}</span>
              <span>{'-'}</span>
              <span>{pageData.totalPages}</span>
              <span>{' of '}</span>
              <span>{pageData.totalElements}</span>
              <span>{pageData.totalElements>1? ' results': ' result'}</span>
            </div>
            <div>
              <span>Sort by laster</span>
            </div>
          </div>
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
                    <ProductItem
                      reSize="col-6 col-lg-4 product-item"
                      product={item}
                      key={item.id}
                    />
                  ))}
                </div>
                <div className="mt-4">
                  <Pagination
                    defaultCurrent={pageData.currentPage}
                    total={pageData.totalElements}
                    align="end"
                    onChange={async (v) => {
                      pageRef.current = v.toString();
                      updateSearchParamsValue("page", v);
                    }}
                    pageSize={9}
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

// export async function getServerSideProps(context: any) {
//   const { categoryIds, page, search } = context.query;

//   // Chuyển categoryIds thành mảng nếu cần
//   const categoryIdsArray = categoryIds ? categoryIds.split(',') : [];

//   return {
//     props: {
//       categoryIds: categoryIdsArray,
//       page: page || '1', // Dự phòng nếu không có page
//       search: search || ''
//     }
//   };
// }
