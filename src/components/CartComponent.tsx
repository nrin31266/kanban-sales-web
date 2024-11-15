import { PageResponse } from "@/model/AppModel";
import { CartResponse } from "@/model/CartModel";
import { removeProduct } from "@/reducx/reducers/cartReducer";
import { Avatar, Button, Card, List, Modal, Space, Typography } from "antd";
import React, { useState } from "react";
import { RiDeleteBinFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import ChangeSubProduct from "./ChangeSubProduct";
import { CgArrowsExchange } from "react-icons/cg";
import { IoClose } from "react-icons/io5";
import { TbReload } from "react-icons/tb";
import { TfiExchangeVertical } from "react-icons/tfi";

interface Props {
  pageData: PageResponse<CartResponse>;
  onFinish: () => void;
  onClose: (e: any) => void;
  onOpen: () => void;
}

const CartComponent = (props: Props) => {
  const { pageData, onClose, onFinish, onOpen } = props;
  const products = pageData.data;
  const dispatch = useDispatch();
  const [isVisibleChangeModal, setIsVisibleChangeModal] = useState(false);
  const [cartSelected, setCartSelected] = useState<CartResponse>();
  return (
    <Card
      className="cart"
      title={
        <div className="row">
          <div className="col">
            <Typography.Title level={5}>
              {products.length} new items, {pageData.totalElements} All
            </Typography.Title>
          </div>
          <div className="col-3 text-right">
            <Button
              size="small"
              icon={<IoClose size={20} />}
              onClick={(e) => onClose(e)}
            ></Button>
          </div>
        </div>
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={products}
        renderItem={(item, index) => (
          <List.Item
            className="cart-item"
            // extra={
            //   <div>
            //     <div>
            //       <Button
            //         onClick={() => {
            //           onClose();
            //           setCartSelected(item);
            //           setIsVisibleChangeModal(true);
            //         }}
            //         icon={<TfiExchangeVertical size={20} />}
            //       ></Button>
            //     </div>
            //     <div className="mt-1">
            //       <Button
            //         onClick={(e) => {
            //           e.preventDefault();
            //           dispatch(removeProduct(item));
            //         }}
            //         type="text"
            //         icon={<RiDeleteBinFill className="text-danger" size={18} />}
            //       ></Button>
            //     </div>
            //   </div>
            // }
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  style={{ borderRadius: 0 }}
                  size={50}
                  shape="square"
                  src={item.imageUrl}
                />
              }
              title={<a>{item.title}</a>}
              description={
                <Space>
                  {item.subProductResponse &&
                    item.subProductResponse.options &&
                    Object.keys(item.subProductResponse.options).length > 0 &&
                    Object.entries(item.subProductResponse.options).map(
                      ([key, value]) => (
                        <span key={item.subProductId + key + value}>
                          <Typography.Text style={{ fontWeight: "400" }}>
                            {key}
                            {": "}
                          </Typography.Text>
                          {value as string}
                        </span>
                      )
                    )}
                </Space>
              }
            />
          </List.Item>
        )}
        style={{ maxHeight: "550px", overflowY: "auto" }}
      />

      <div>
        <Button style={{ width: "100%" }} type="primary" size="large">
          View all cart
        </Button>
      </div>
      {cartSelected && (
        <ChangeSubProduct
          isVisible={isVisibleChangeModal}
          onChange={() => {}}
          onClose={() => {
            setIsVisibleChangeModal(false);
            onOpen();
          }}
          productId={cartSelected.productId}
          subProductId={cartSelected.subProductId}
          type="change"
          initCount={cartSelected.count}
        />
      )}
    </Card>
  );
};

export default CartComponent;
