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
import { CartRequest, CartResponse } from "@/model/CartModel";
import { PageResponse } from "@/model/AppModel";
import ChangeSubProduct from "@/components/ChangeSubProduct";

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
  const cart: PageResponse<CartResponse> = useSelector(cartSelector);
  const dispatch = useDispatch();

  const handleCart = async () => {
    if (!auth.accessToken) {
      router.push(`${PAGE.LOGIN}?productId=${product.id}&slug=${product.slug}`);
      return;
    } else if (subProductSelected && auth.userInfo) {
      const item: CartRequest = {
        count: count,
        createdBy: auth.userInfo.id,
        imageUrl:
          subProductSelected.images && subProductSelected.images.length > 0
            ? subProductSelected.images[0]
            : product.images[0],
        productId: product.id,
        subProductId: subProductSelected.id,
        subProductResponse: subProductSelected,
        title: product.title,
      };
      dispatch(addProduct(item));
      setCount(1);
    }
  };

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
