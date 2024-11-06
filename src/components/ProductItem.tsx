import { ProductResponse } from "@/model/ProductModel";
import { Button, Typography } from "antd";
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
    <div
      onClick={() => router.push(`/products/${product.id}/${product.slug}`)}
      ref={ref}
      key={product.id}
      className="col-6 col-md-4 col-lg-3 product-item p-2"
    >
      {product.images && product.images.length > 0 ? (
        <>
          <div className="image" style={{ backgroundColor: "#e0e0e0" }}>
            <img
              width={"100%"}
              height={elementWidth ? elementWidth * 1.1 : 250}
              src="https://i.pinimg.com/736x/47/50/22/47502277fa068232f5a3556f18c362a2.jpg"
              alt={product.slug}
            />
          </div>
          <div className="hover-content" style={{
            
          }}> 
            <div className="top-right">
              <Button>J</Button> <br />
              <Button>J</Button> <br />
              <Button>J</Button>
            </div>
            <div className="bottom">
              <Button style={{width: '50%'}}>J đó</Button>
            </div>
          </div>
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
      <div>
        <Typography.Paragraph style={{ fontWeight: "bold" }}>
          {product.title}
        </Typography.Paragraph>
        <Typography.Paragraph style={{ fontSize: "1.1em" }}>
          {product.maxPrice && product.minPrice
            ? product.maxPrice === product.minPrice
              ? product.maxPrice
              : `${product.minPrice} - ${product.maxPrice}`
            : "Hihi"}
        </Typography.Paragraph>
      </div>
    </div>
  );
};

export default ProductItem;
