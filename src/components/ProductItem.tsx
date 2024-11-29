import { colors } from "@/constants/appInfos";
import { ProductResponse } from "@/model/ProductModel";
import { FormatCurrency } from "@/utils/formatNumber";
import { Button, Typography } from "antd";

import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { GoStarFill } from "react-icons/go";

import { MdImage } from "react-icons/md";
import { TfiLayoutLineSolid } from "react-icons/tfi";

interface Props {
  product: ProductResponse;
  reSize?: string
}

const ProductItem = (props: Props) => {
  const { product, reSize } = props;
  const [elementWidth, setElementWidth] = useState();
  const router = useRouter();
  const ref = useRef<any>();
  useEffect(() => {
    const width = ref.current?.offsetWidth;
    setElementWidth(width);
  }, []);
  

  return (
    <div className={reSize?? 'col-6 col-md-4 col-lg-3 product-item'}>
      <div className="product-item-layout">
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
          <Typography.Text className="price" style={{ fontSize: "1.2em", color: colors[5] }}>
            {product.maxPrice && product.minPrice
              ? product.maxPrice === product.minPrice
                ? FormatCurrency.VND.format(product.maxPrice)
                : `${FormatCurrency.VND.format(
                    product.minPrice
                  )} - ${FormatCurrency.VND.format(product.maxPrice)}`
              : "N/A"}
          </Typography.Text>
          
        </div>
        {
            product.totalSold > 0 && <div className="d-flex" style={{alignItems: 'center'}}>
              <div style={{backgroundColor: 'rgb(252, 234, 164,0.1)', border: '1px solid rgb(252, 234, 164)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 5px'}} className="p-1">
                <GoStarFill color={colors[4]} size={15}/>
                <Typography.Text>{product.averageRating.toFixed(1)}</Typography.Text>
              </div>
              <div className="ml-1 mr-1">
                <span><TfiLayoutLineSolid style={{transform: 'rotate(90deg)'}} /></span>
              </div>
              <div>
                <Typography.Text>{product.totalSold}</Typography.Text>
                <span>{' sold'}</span>
              </div>
            </div>
          }
      </a>
      </div>
    </div>
  );
};

export default ProductItem;
