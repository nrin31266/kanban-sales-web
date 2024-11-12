import { API, APP, PAGE } from "@/configurations/configurations";
import { CustomAxiosResponse } from "@/model/AxiosModel";
import { ProductResponse } from "@/model/ProductModel";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { SubProductResponse } from "./../../../../model/SubProduct";
import HeadComponent from "@/components/HeadComponent";
import { Breadcrumb, Button, Rate, Space, Tag, Typography } from "antd";
import Link from "next/link";
import { FormatCurrency } from "@/utils/formatNumber";
import ScrollItems from "@/components/ScrollItems";
import { MdAdd, MdOutlineRemove } from "react-icons/md";
import { IoMdHeart } from "react-icons/io";
import { isMapsOptionsEqual } from "@/utils/compare";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "@/reducx/reducers/authReducer";
import { AuthModel } from "@/model/AuthenticationModel";
import { useRouter } from "next/router";
import { addProduct, cartSelector } from "@/reducx/reducers/cartReducer";

const ProductDetail = ({
  initProduct,
  initProductDetail,
}: {
  initProduct: ProductResponse;
  initProductDetail: SubProductResponse[];
}) => {
  const [product, setProduct] = useState<ProductResponse>(initProduct);
  const [productDetail, setProductDetail] =
    useState<SubProductResponse[]>(initProductDetail);
  const [subProductSelected, setSubProductSelected] =
    useState<SubProductResponse>();
  const [count, setCount] = useState(1);
  const [photoSelected, setPhotoSelected] = useState(
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://th.bing.com/th/id/R.b16b871600d4270d75d30babff3507d6?rik=jsJKr9%2bb8%2fuIzQ&pid=ImgRaw&r=0"
  );
  const [optionSelected, setOptionSelected] = useState<Map<string, string>>(
    new Map()
  );
  const auth: AuthModel = useSelector(authSelector);
  const router = useRouter();
  const cart : SubProductResponse[] = useSelector(cartSelector);
  const dispatch = useDispatch();


  console.log(cart);


  useEffect(() => {
    console.log("hihi");

    if (optionSelected && optionSelected.size > 0) {
      for (const sub of productDetail) {
        if (sub.options && Object.keys(sub.options).length > 0) {
          const map: Map<string, string> = new Map();
          Object.entries(sub.options).forEach(([key, value]) => {
            if (typeof value === "string") map.set(key, value);
          });
          if (isMapsOptionsEqual(map, optionSelected)) {
            setSubProductSelected(sub);
            if (sub.images && sub.images.length > 0) {
              setPhotoSelected(sub.images[0]);
            }
            break;
          }
        }
      }
    }
  }, [optionSelected]);

  useEffect(() => {
    getListOptions();
    setInitOptions();
  }, []);

  useEffect(() => {
    if (subProductSelected) {
      if (subProductSelected.quantity > 0) {
        setCount(1);
      } else {
        setCount(0);
      }
    }
  }, [subProductSelected]);

  const setInitOptions = () => {
    if (productDetail && productDetail.length > 0) {
      productDetail.forEach((sub) => {
        if (sub.quantity > 0) {
          setOptions(sub);
          return;
        }
      });
    }
  };

  const handleCart = async () => {
    if (!auth.accessToken) {
      router.push(`${PAGE.LOGIN}?productId=${product.id}&slug=${product.slug}`);
      return;
    } else if(subProductSelected && auth.userInfo){
      const item: SubProductResponse = {...subProductSelected, count: count, createdBy: auth.userInfo.id};
      dispatch(addProduct(item));
      setCount(1);
    }
  };

  const renderButtonGroup = ()=>{

    let item : SubProductResponse | undefined= cart.find((ele)=> ele.id === subProductSelected?.id);
    

    return subProductSelected && <Space className="mt-3">
      <Typography.Title level={5} type="secondary">{'Available: '}{item? subProductSelected.quantity - item.count : subProductSelected.quantity}</Typography.Title>
    <div
      style={{
        border: "1px solid silver",
        borderRadius: 6,
        padding: "5px 8px",
      }}
    >
      <button
        id="btn-des"
        onClick={() => setCount(count - 1)}
        disabled={count <= 1}
      >
        <MdOutlineRemove />
      </button>
      <Typography.Text
        style={{ fontWeight: "bold" }}
        className="ml-3 mr-3"
      >
        {count}
      </Typography.Text>
      <button

        id="btn-asc"
        onClick={() => setCount(count + 1)}
        disabled={item? (count >= (subProductSelected.quantity - item.count)) : (count >= subProductSelected.quantity)}
      >
        <MdAdd />
      </button>
    </div>
    <Button
      onClick={() => handleCart()}
      type="primary"
      disabled={item? (count > (subProductSelected.quantity - item.count)) : (count > subProductSelected.quantity)}
    >
      Add to cart
    </Button>
    <Button
      style={{ color: "silver" }}
      icon={<IoMdHeart size={20} />}
    />
  </Space>
  }

  const setOptions = (sub: SubProductResponse) => {
    if (sub.options && Object.keys(sub.options).length > 0) {
      const map: Map<string, string> = new Map();
      Object.entries(sub.options).forEach(([key, value]) => {
        if (typeof value === "string") map.set(key, value);
      });
      setOptionSelected(map);
    }
  };

  const [listOptions, setListOptions] = useState<Map<string, Set<string>>>();

  const getListOptions = () => {
    const map: Map<string, Set<string>> = new Map();
    if (product.options && product.options.length > 0) {
      product.options.forEach((option) => map.set(option, new Set()));
    }
    productDetail.forEach((subPro) => {
      if (
        subPro.options &&
        typeof subPro.options === "object" &&
        !Array.isArray(subPro.options)
      ) {
        Object.entries(subPro.options).forEach(([key, value]) => {
          if (typeof value === "string") {
            const optionSet = map.get(key);
            if (optionSet) {
              optionSet.add(value);
            }
          } else {
            console.warn(`Invalid value for key "${key}":`, value);
          }
        });
      } else {
        console.warn("subPro.options is not an object:", subPro.options);
      }
    });
    setListOptions(map);
  };

  useEffect(() => {}, [listOptions]);

  return (
    <div>
      <HeadComponent
        title={product.title}
        description={product.description}
        image={product.images[0] ?? undefined}
        url={`${APP.baseURL}/products/${product.id}/${product.slug}`}
      />
      <div className="container-fluid">
        <div className="container mt-3 product-detail">
          <Breadcrumb
            items={[
              {
                key: "home",
                title: <Link href={PAGE.HOME}>Home</Link>,
              },
              {
                key: "shop",
                title: <Link href={PAGE.SHOP}>Shop</Link>,
              },
              {
                key: "blablabla",
                title: product.title,
              },
            ]}
          />
          {subProductSelected ? (
            <>
              <div className="row mt-3" style={{ backgroundColor: "white" }}>
                <div className="col-sm-12 col-md-4">
                  <div
                    className="text-center p-4"
                    style={{ backgroundColor: "#e0e0e0" }}
                  >
                    <img src={photoSelected} width={"100%"} alt="" />
                  </div>
                  <ScrollItems
                    onPhotoSelected={(p) => setPhotoSelected(p)}
                    product={product}
                    items={productDetail}
                    onClick={(values) => {
                      if (values) {
                        setOptions(values);
                      }
                    }}
                  />
                </div>
                <div className="col">
                  <div className="row">
                    <div className="col-sm-12 col-md-8">
                      <Typography.Title level={3}>
                        {product.title}
                      </Typography.Title>
                    </div>
                    <div className="col">
                      <Space>
                        <Tag
                          color={
                            subProductSelected.quantity > 0 ? "green" : "red"
                          }
                        >
                          {subProductSelected.quantity > 0
                            ? "In stock"
                            : "Out stock"}
                        </Tag>
                        <Typography.Title level={5}>Sold 100</Typography.Title>
                      </Space>
                    </div>
                  </div>
                  <div>
                    <Typography.Title type="secondary" level={5}>
                      {product.supplierResponse.name}
                    </Typography.Title>
                    <div>
                      <Rate disabled defaultValue={5} />
                      <Typography.Text type="secondary">(5.0)</Typography.Text>
                      <Typography.Text type="secondary">
                        (1024 Reviews)
                      </Typography.Text>
                    </div>
                    {subProductSelected.discount ? (
                      <Space>
                        <Typography.Title level={3}>
                          {FormatCurrency.VND.format(
                            subProductSelected.discount
                          )}
                        </Typography.Title>
                        <Typography.Title type="secondary" level={3}>
                          <del>
                            {" "}
                            {FormatCurrency.VND.format(
                              subProductSelected.price
                            )}
                          </del>
                        </Typography.Title>
                      </Space>
                    ) : (
                      <Typography.Title level={3}>
                        {FormatCurrency.VND.format(subProductSelected.price)}
                      </Typography.Title>
                    )}
                    <p className="mb-0">{product.description}</p>
                    {listOptions &&
                      Array.from(listOptions.entries()).map(
                        ([key, valuesSet]) => (
                          <div key={key}>
                            <Typography.Title className="mb-2 mt-2" level={5}>{key}</Typography.Title>
                            {Array.from(valuesSet).map((value) => {
                              let isDisabled = true;
                              // Duyệt qua từng sản phẩm
                              for (let i = 0; i < productDetail.length; i++) {
                                const sub = productDetail[i];
                                // Bước 1: Kiểm tra xem sản phẩm có tùy chọn không
                                if (!sub.options) {
                                  continue; // Nếu không có tùy chọn thì bỏ qua sản phẩm này
                                }
                                // Bước 2: Kiểm tra nếu sản phẩm có giá trị khớp với `key` và `value`
                                if (sub.options[key] !== value) {
                                  continue; // Nếu không khớp với `size`, bỏ qua sản phẩm này
                                }

                                // Bước 3: Kiểm tra tất cả các tùy chọn đã chọn có khớp với sản phẩm
                                let allOptionsValid = true;
                                for (let [optKey, optValue] of optionSelected) {
                                  // Nếu `optKey` không phải là `key`, kiểm tra xem giá trị có khớp không
                                  if (
                                    optKey !== key &&
                                    sub.options[optKey] !== optValue
                                  ) {
                                    allOptionsValid = false;
                                    break; // Nếu có một tùy chọn không hợp lệ thì dừng kiểm tra
                                  }
                                }

                                // Bước 4: Nếu tất cả các tùy chọn khớp, sản phẩm này hợp lệ
                                if (allOptionsValid) {
                                  isDisabled = false; // Sản phẩm hợp lệ, cho phép nhấn nút
                                  break; // Dừng kiểm tra sau khi tìm thấy sản phẩm hợp lệ đầu tiên
                                }
                              }

                              return (
                                <Button
                                  type={
                                    optionSelected.get(key) === value
                                      ? "primary"
                                      : "default"
                                  }
                                  onClick={() => {
                                    const newMap = new Map(optionSelected);
                                    newMap.set(key, value);
                                    setOptionSelected(newMap);
                                  }}
                                  className="p-1 mr-1"
                                  key={value}
                                  disabled={isDisabled}
                                >
                                  {
                                    key === 'Color' && <div style={{border: '1px solid silver', backgroundColor: value, borderRadius: 100, width: 20, height: 20}}></div>
                                  }
                                  {value}
                                </Button>
                              );
                            })}
                          </div>
                        )
                      )}

                    {
                      renderButtonGroup()
                    }
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>Empty</>
          )}
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps(context: any) {
  try {
    const resProduct: CustomAxiosResponse<ProductResponse> = await axios(
      `${APP.baseURL}${API.PRODUCTS}/${context.params.productId}`
    );

    const resProductDetail: CustomAxiosResponse<SubProductResponse[]> =
      await axios(
        `${APP.baseURL}${API.PRODUCT_DETAIL(context.params.productId)}`
      );

    return {
      props: {
        initProductDetail: resProductDetail.data.result,
        initProduct: resProduct.data.result,
      },
    };
  } catch (error) {
    return {
      props: {
        initProductDetail: [],
        initProduct: [],
      },
    };
  }
}

export async function getStaticPaths() {
  // When this is true (in preview environments) don't
  // prerender any static pages
  // (faster builds, but slower initial page load)
  return {
    paths: [],
    fallback: "blocking",
  };
}
export default ProductDetail;
