import ChangeSubProduct from "@/components/ChangeSubProduct";
import HeadComponent from "@/components/HeadComponent";
import ScrollItems from "@/components/ScrollItems";
import { API, APP, PAGE } from "@/configurations/configurations";
import { CustomAxiosResponse } from "@/model/AxiosModel";
import { ProductResponse } from "@/model/ProductModel";
import { FormatCurrency } from "@/utils/formatNumber";
import { Breadcrumb, Rate, Space, Tag, Typography } from "antd";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { SubProductResponse } from "./../../../../model/SubProduct";

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
  const [photoSelected, setPhotoSelected] = useState(
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://th.bing.com/th/id/R.b16b871600d4270d75d30babff3507d6?rik=jsJKr9%2bb8%2fuIzQ&pid=ImgRaw&r=0"
  );
  

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
                    // setOptions(values);
                  }
                }}
              />
            </div>
            <div className="col">
              <div className="row">
                <div className="col-sm-12 col-md-8">
                  <Typography.Title level={3}>{product.title}</Typography.Title>
                </div>
                <div className="col">
                  <Space>
                    <Tag
                      color={
                        subProductSelected && subProductSelected.quantity > 0
                          ? "green"
                          : "red"
                      }
                    >
                      {subProductSelected && subProductSelected.quantity > 0
                        ? "In stock"
                        : "Out stock"}
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
                        {FormatCurrency.VND.format(subProductSelected.discount)}
                      </Typography.Title>
                      <Typography.Title type="secondary" level={3}>
                        <del>
                          {" "}
                          {FormatCurrency.VND.format(subProductSelected.price)}
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
                onChangeProductDetail={(v, im) => {
                  setSubProductSelected(v);
                  setPhotoSelected(im);
                }}
              />
            </div>
          </div>
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
