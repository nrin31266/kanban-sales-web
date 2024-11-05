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
        <div className="p-0" style={{ backgroundColor: "#e0e0e0" }}>
          <div
            className="image mt-1"
            style={{
              height: elementWidth ? elementWidth * 1 : 250,
              width: "100%",
              background: `url('${product.images[0]}')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              border: "4px",
            }}
            // src={'https://th.bing.com/th/id/OIP.qeI5ebWY0xxZdCGUMxrzWAHaNK?rs=1&pid=ImgDetMain'}
          >
            <div
              className="image-content"
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div style={{ flex: 1 }} className="text-right mr-1">
                <div>
                  <Button
                   onClick={(e) => e.stopPropagation()}
                    style={{ borderRadius: "50%" }}
                    className="mb-2 btn-icon mt-2"
                    icon={<FcLike size={20} />}
                  ></Button>
                </div>
                <div>
                  <Button
                   onClick={(e) => e.stopPropagation()}
                    style={{ borderRadius: "50%" }}
                    className="mb-2 btn-icon"
                    icon={<BiTransfer size={20} />}
                  ></Button>
                </div>
                <div>
                  <Button
                   onClick={(e) => e.stopPropagation()}
                    style={{ borderRadius: "50%" }}
                    className="mb-2 btn-icon"
                    icon={<IoMdAdd size={20} />}
                  ></Button>
                </div>
              </div>
              <div className="text-center mb-2">
                <Button  onClick={(e) => {
                    e.stopPropagation();
                    console.log('view');
                }} style={{ width: "50%" }}>
                  <FaEye /> View
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: elementWidth ? elementWidth * 1 : 250,
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
