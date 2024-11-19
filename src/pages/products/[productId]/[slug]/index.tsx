import ChangeSubProduct from "@/components/ChangeSubProduct";
import HeadComponent from "@/components/HeadComponent";
import ScrollItems from "@/components/ScrollItems";
import { API, APP, PAGE } from "@/configurations/configurations";
import { CustomAxiosResponse } from "@/model/AxiosModel";
import { ProductResponse } from "@/model/ProductModel";
import { FormatCurrency } from "@/utils/formatNumber";
import { Breadcrumb, Empty, Image, Rate, Space, Tabs, Tag, Typography } from "antd";
import axios from "axios";
import Link from "next/link";
import { useState, useMemo, useCallback } from "react";
import { SubProductResponse } from "./../../../../model/SubProduct";
import TabBarComponent from "@/components/TabBarComponent";
import Section from "@/components/Section";

const ProductDetail = ({
  productProp,
  productDetailProp,
  relatedProductsProp,
}: {
  productProp: ProductResponse;
  productDetailProp: SubProductResponse[];
  relatedProductsProp: ProductResponse[];
}) => {
  const [product, setProduct] = useState<ProductResponse>(productProp);
  const [productDetail, setProductDetail] =
    useState<SubProductResponse[]>(productDetailProp);
  const [subProductSelected, setSubProductSelected] =
    useState<SubProductResponse>();
  const [photoSelected, setPhotoSelected] = useState<string>();
  const [relatedProducts, setRelatedProducts] = useState(relatedProductsProp);

  // useMemo to avoid unnecessary re-rendering
  const productStatus = useMemo(() => {
    if (!subProductSelected) return "Out stock"; // Nếu không có subProductSelected, mặc định là Out stock
    return subProductSelected.quantity > 0 ? "In stock" : "Out stock"; // Nếu có subProductSelected thì kiểm tra quantity
  }, [subProductSelected]);

  const handleSubProductChange = useCallback(
    (subProduct: SubProductResponse, image: string) => {
      setSubProductSelected(subProduct);
      setPhotoSelected(image);
    },
    []
  );

  return (
    <div>
      {product ? (
        <div>
          <HeadComponent
            title={product.title}
            description={product.description}
            image={product.images[0] ?? undefined}
            url={`${APP.baseURL}/products/${product.id}/${product.slug}`}
          />
          <div className="container mt-3 product-detail">
            <div className="bg-white">
            <Breadcrumb
              items={[
                { key: "home", title: <Link href={PAGE.HOME}>Home</Link> },
                { key: "shop", title: <Link href={PAGE.SHOP}>Shop</Link> },
                { key: "product", title: product.title },
              ]}
            />
            </div>
            <div className="row mt-3" style={{ backgroundColor: "white" }}>
              <div className="col-sm-12 col-md-4">
                <div
                  className="text-center p-4"
                  style={{ backgroundColor: "#e0e0e0" }}
                >
                  <Image src={photoSelected} width="100%" alt="Product image" />
                </div>
                <ScrollItems
                  onClick={() => {}}
                  onPhotoSelected={setPhotoSelected}
                  product={product}
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
                          subProductSelected
                            ? subProductSelected.quantity > 0
                              ? "green"
                              : "red"
                            : "orange"
                        }
                      >
                        {productStatus}
                      </Tag>
                      <Typography.Title level={5}>Sold 100</Typography.Title>
                    </Space>
                  </div>
                </div>
                {subProductSelected && (
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
                  </div>
                )}
                <ChangeSubProduct
                  isVisible={true}
                  type="main"
                  initData={{
                    product: product,
                    subProducts: productDetail,
                  }}
                  onChangeProductDetail={handleSubProductChange}
                />
              </div>
            </div>
            <Section
              children={
                <div className="bg-white">
                  <Tabs
                    items={[
                      {
                        key: "tab-1",
                        label: "Description",
                        children: (
                          <>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Possimus ducimus dolore nesciunt cupiditate
                            error adipisci minus, culpa excepturi! Quas
                            necessitatibus numquam inventore a sapiente saepe
                            dolores officiis error est reprehenderit!
                          </>
                        ),
                        
                      },
                      {
                        key: "tab-2",
                        label: "Additional Ifnomations",
                        children: (
                          <>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Possimus ducimus dolore nesciunt cupiditate
                            error adipisci minus, culpa excepturi! Quas
                            necessitatibus numquam inventore a sapiente saepe
                            dolores officiis error est reprehenderit!
                          </>
                        ),
                        
                      },
                      {
                        key: "tab-3",
                        label: "Reviews",
                        children: (
                          <>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Possimus ducimus dolore nesciunt cupiditate
                            error adipisci minus, culpa excepturi! Quas
                            necessitatibus numquam inventore a sapiente saepe
                            dolores officiis error est reprehenderit!
                          </>
                        ),
                        
                      },
                    ]}
                  />
                </div>
              }
            />
            <Section
              children={
                <TabBarComponent
                  title="Related products"
                  titleLevel={5}
                  children={"fâfafa"}
                />
              }
            />
          </div>
        </div>
      ) : (
        <Empty />
      )}
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

    const resRelatedProducts: CustomAxiosResponse<ProductResponse[]> =
      await axios(
        `http://localhost:8888/api/v1/kanban/products/related/${context.params.productId}`
      );

    return {
      props: {
        productDetailProp: resProductDetail.data.result,
        productProp: resProduct.data.result,
        relatedProductsProp: resRelatedProducts.data.result,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        productDetailProp: [],
        productProp: null,
        relatedProductsProp: [],
      },
    };
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default ProductDetail;
