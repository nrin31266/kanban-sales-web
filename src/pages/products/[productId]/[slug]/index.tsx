import ChangeSubProduct from "@/components/ChangeSubProduct";
import HeadComponent from "@/components/HeadComponent";
import ScrollItems from "@/components/ScrollItems";
import { API, APP, PAGE } from "@/configurations/configurations";
import { CustomAxiosResponse } from "@/model/AxiosModel";
import { ProductResponse } from "@/model/ProductModel";
import { FormatCurrency } from "@/utils/formatNumber";
import {
  Breadcrumb,
  Empty,
  Image,
  Rate,
  Space,
  Skeleton,
  Tabs,
  Tag,
  Typography,
} from "antd";
import axios from "axios";
import Link from "next/link";
import { useState, useMemo, useCallback, useEffect } from "react";
import { SubProductResponse } from "./../../../../model/SubProduct";
import TabBarComponent from "@/components/TabBarComponent";
import Section from "@/components/Section";
import ProductItem from "@/components/ProductItem";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Reviews from "@/components/Reviews";
import LoadingComponent from "@/components/LoadingComponent";

// {
//   productProp,
//   productDetailProp,
//   relatedProductsProp,
// }: {
//   productProp: ProductResponse;
//   productDetailProp: SubProductResponse[];
//   relatedProductsProp: ProductResponse[];
// }
const ProductDetail = () => {
  const [product, setProduct] = useState<ProductResponse>();
  const [productDetail, setProductDetail] = useState<SubProductResponse[]>();
  const [subProductSelected, setSubProductSelected] =
    useState<SubProductResponse>();
  const [photoSelected, setPhotoSelected] = useState<string | undefined>();
  const [relatedProducts, setRelatedProducts] = useState<ProductResponse[]>();
  const router = useRouter();
  const { productId } = router.query;
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   setProduct(productProp);
  //   setProductDetail(productDetailProp);
  //   setRelatedProducts(relatedProductsProp);
  //   !(productDetailProp.length > 0) && setPhotoSelected(productProp.images[0]);
  //   setSubProductSelected(undefined);
  //   console.log("change");
  // }, [productProp, productDetailProp, relatedProductsProp]);

  useEffect(() => {
    if (!productId) return;

    const fetchProductData = async () => {
      setIsLoading(true);
      try {
        const resProduct = await axios(
          `${APP.baseURL}${API.PRODUCTS}/${productId}`
        );
        const resProductDetail = await axios(
          `${APP.baseURL}${API.PRODUCT_DETAIL(productId as string)}`
        );
        const resRelatedProducts = await axios(
          `http://localhost:8888/api/v1/kanban/products/related/${productId}`
        );

        setProduct(resProduct.data.result);
        setProductDetail(resProductDetail.data.result);
        setRelatedProducts(resRelatedProducts.data.result);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const productStatus = useMemo(() => {
    if (!subProductSelected) return "Out stock";
    return subProductSelected.quantity > 0 ? "In stock" : "Out stock";
  }, [subProductSelected]);

  const handleSubProductChange = useCallback(
    (subProduct: SubProductResponse, image: string) => {
      setSubProductSelected(subProduct);
      setPhotoSelected(image);
    },
    []
  );

  return isLoading ? (
    <LoadingComponent />
  ) : (
    <div>
      {product ? (
        <div>
          <HeadComponent
            title={product.title}
            description={product.description}
            image={product.images[0] ?? undefined}
            url={`${APP.baseURL}/products/${product.id}/${product.slug}`}
          />
          <div className="container product-detail">
            <div className="bg-white">
              <Breadcrumb
                items={[
                  { key: "home", title: <Link href={PAGE.HOME}>Home</Link> },
                  { key: "shop", title: <Link href={PAGE.SHOP}>Shop</Link> },
                  { key: "product", title: product.title },
                ]}
              />
            </div>
            <div className="row m-0" style={{ backgroundColor: "white" }}>
              <div className="col-sm-12 col-md-4">
                <div className="text-center p-4">
                  <Image src={productDetail&&productDetail?.length> 0? photoSelected : product.images[0]} width="100%" alt="Product image" />
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
                  </div>
                )}
                {productDetail && productDetail.length > 0 && (
                  <ChangeSubProduct
                    isVisible={true}
                    type="main"
                    initData={{
                      product: product,
                      subProducts: productDetail,
                    }}
                    onChangeProductDetail={handleSubProductChange}
                  />
                )}
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
                        children: product.description,
                      },
                      {
                        key: "tab-2",
                        label: "Reviews",
                        children: <Reviews productId={product.id} />,
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
                  children={
                    <div className="row m-0">
                      {relatedProducts &&
                        relatedProducts.length > 0 &&
                        relatedProducts.map((item) => (
                          <ProductItem key={item.id} product={item} />
                        ))}
                    </div>
                  }
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

// export const getServerSideProps: GetServerSideProps = async (context: any) => {
//   try {
//     const resProduct: CustomAxiosResponse<ProductResponse> = await axios(
//       `${APP.baseURL}${API.PRODUCTS}/${context.params.productId}`
//     );

//     const resProductDetail: CustomAxiosResponse<SubProductResponse[]> =
//       await axios(
//         `${APP.baseURL}${API.PRODUCT_DETAIL(context.params.productId)}`
//       );

//     const resRelatedProducts: CustomAxiosResponse<ProductResponse[]> =
//       await axios(
//         `http://localhost:8888/api/v1/kanban/products/related/${context.params.productId}`
//       );

//     return {
//       props: {
//         productProp: resProduct.data.result,
//         productDetailProp: resProductDetail.data.result,
//         relatedProductsProp: resRelatedProducts.data.result,
//       },
//     };
//   } catch (error) {
//     return {
//       props: {},
//     };
//   }
// };

// export const getStaticPaths = async () => {
//   return {
//     paths: [],
//     fallback: "blocking",
//   };
// };

// export async function getStaticProps(context: any) {
//   try {
//     const resProduct: CustomAxiosResponse<ProductResponse> = await axios(
//       `${APP.baseURL}${API.PRODUCTS}/${context.params.productId}`
//     );

//     const resProductDetail: CustomAxiosResponse<SubProductResponse[]> =
//       await axios(
//         `${APP.baseURL}${API.PRODUCT_DETAIL(context.params.productId)}`
//       );

//     const resRelatedProducts: CustomAxiosResponse<ProductResponse[]> =
//       await axios(
//         `http://localhost:8888/api/v1/kanban/products/related/${context.params.productId}`
//       );
//     return {
//       props: {
//         productDetailProp: resProductDetail.data.result,
//         productProp: resProduct.data.result,
//         relatedProductsProp: resRelatedProducts.data.result,
//       },
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       props: {
//         productDetailProp: [],
//         productProp: null,
//         relatedProductsProp: [],
//       },
//     };
//   }
// }

export default ProductDetail;
