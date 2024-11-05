import { API, APP } from "@/configurations/configurations";
import { CustomAxiosResponse } from "@/model/AxiosModel";
import { ProductResponse } from "@/model/ProductModel";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { SubProductResponse } from './../../../../model/SubProduct';

const ProductDetail = ({product, productDetail} : {product: ProductResponse, productDetail: SubProductResponse[]}) => {

  useEffect(() => {
    console.log(product, productDetail);
  }, []);
  return <div>ProductDetail</div>;
};

export async function getStaticProps(context: any) {
  try {
    const resProduct: CustomAxiosResponse<ProductResponse> = await axios(
      `${APP.baseURL}${API.PRODUCTS}/${context.params.productId}`
    );

    const resProductDetail: CustomAxiosResponse<SubProductResponse[]> = await axios(
      `${APP.baseURL}${API.PRODUCT_DETAIL(context.params.productId)}`
    );

    return {
      props: {
        productDetail: resProductDetail.data.result, 
        product: resProduct.data.result,
      },
    };
  } catch (error) {
    return {
      props: {
        productDetail: [],
        product: []
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
