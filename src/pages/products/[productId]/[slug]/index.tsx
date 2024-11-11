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
  const [subProductSelected, setSubProductSelected] = useState<
    SubProductResponse | undefined
  >(initProductDetail.length > 0 ? initProductDetail[0] : undefined);
  const [count, setCount] = useState(1);
  const [photoSelected, setPhotoSelected] = useState(
    product.images.length > 0
      ? product.images[0]
      : "https://th.bing.com/th/id/R.b16b871600d4270d75d30babff3507d6?rik=jsJKr9%2bb8%2fuIzQ&pid=ImgRaw&r=0"
  );

  useEffect(() => {
    console.log(initProduct, initProductDetail);
    getListOptions();
  }, []);

  const [listOptions, setListOptions] = useState<Map<string, Set<string>>>();

  const getListOptions = () => {
    const map: Map<string, Set<string>> = new Map();
    if (product.options && product.options.length > 0) {
      product.options.forEach((option) => map.set(option, new Set()));
    }
    productDetail.forEach((subPro) => {
      if (subPro.options && typeof subPro.options === 'object' && !Array.isArray(subPro.options)) {
        Object.entries(subPro.options).forEach(([key, value]) => {
          if (typeof value === 'string') {
            const optionSet = map.get(key);
            if (optionSet) {
              optionSet.add(value);
            }
          } else {
            console.warn(`Invalid value for key "${key}":`, value);
          }
        });
      } else {
        console.warn('subPro.options is not an object:', subPro.options);
      }
    });

    setListOptions(map);
  };

  useEffect(()=>{
    console.log(listOptions);
  }, [listOptions])

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
                      values && setSubProductSelected(values);
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
                        <Tag>
                          {subProductSelected.quantity > 0
                            ? "In stock"
                            : "Out stock"}
                        </Tag>
                        <Typography.Title level={5}>Sold 100</Typography.Title>
                      </Space>
                    </div>
                  </div>
                  <div>
                    <Typography.Title level={5}>
                      {product.supplierId}
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
                    <Typography.Title level={5}>Color</Typography.Title>
                    {product.options.map((option, index) => {
                      productDetail.map((sub, index) => {});
                    })}
                    <br />
                    <Space className="mt-3">
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
                          disabled={count === 1}
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
                          disabled={count === subProductSelected.quantity}
                        >
                          <MdAdd />
                        </button>
                      </div>
                      <Button type="primary">Add to cart</Button>
                      <Button
                        style={{ color: "silver" }}
                        icon={<IoMdHeart size={20} />}
                      />
                    </Space>
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
