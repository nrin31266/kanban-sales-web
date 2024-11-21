import { ProductResponse } from "@/model/ProductModel";
import { FormatCurrency } from "@/utils/formatNumber";
import { Button, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { BiTransfer } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { IoMdAdd } from "react-icons/io";
import { MdImage } from "react-icons/md";

interface Props {
  product: ProductResponse;
}

const ProductItem = (props: Props) => {
  const { product } = props;
  const [elementWidth, setElementWidth] = useState();
  const router = useRouter();
  const ref = useRef<any>();
  useEffect(() => {
    const width = ref.current?.offsetWidth;
    setElementWidth(width);
  }, []);

  return (
    <div className="col-6 col-md-4 col-lg-3 product-item">
      <a
        onClick={() => router.push(`/products/${product.id}/${product.slug}`)}
        ref={ref}
        key={product.id}
      >
        {product.images && product.images.length > 0 ? (
          <>
            <div className="image">
              <img
                width={"100%"}
                height={elementWidth ? elementWidth : 250}
                // src="https://i.pinimg.com/736x/47/50/22/47502277fa068232f5a3556f18c362a2.jpg"
                src={`${product.images[0]}`}
                alt={product.slug}
              />
            </div>
            {/* <div className="hover-content"> 
            <div className="top-right">
              <div> <Button onClick={(e)=>{e.stopPropagation();}} icon={<FcLike size={25}/>}></Button> </div>
              <div><Button onClick={(e)=>{e.stopPropagation();}} icon={<BiTransfer size={25}/>}></Button> </div>
              <div><Button onClick={(e)=>{e.stopPropagation();}} icon={<FaEye size={25}/>}></Button></div>
            </div>
            <div className="bottom">
              <Button onClick={(e)=>{e.stopPropagation();}} style={{width: '50%'}} icon={<IoMdAdd />}>Add to cart</Button>
            </div>
          </div> */}
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: elementWidth ? elementWidth * 1.1 : 250,
              backgroundColor: `#e0e0e0`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MdImage size={32} />
          </div>
        )}
        <div className="title-content">
          <Typography.Text className="title" style={{ fontWeight: "500" }}>
            {product.title}
          </Typography.Text>
          <Typography.Text style={{ fontSize: "1.2em", color: "#1a73e8" }}>
            {product.maxPrice && product.minPrice
              ? product.maxPrice === product.minPrice
                ? FormatCurrency.VND.format(product.maxPrice)
                : `${FormatCurrency.VND.format(
                    product.minPrice
                  )} - ${FormatCurrency.VND.format(product.maxPrice)}`
              : "N/A"}
          </Typography.Text>
        </div>
      </a>
    </div>
  );
};

export default ProductItem;
