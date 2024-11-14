import { PageResponse } from "@/model/AppModel";
import { CartResponse } from "@/model/CartModel";
import { removeProduct } from "@/reducx/reducers/cartReducer";
import { Avatar, Button, Card, List, Modal, Space, Typography } from "antd";
import React from "react";
import { RiDeleteBinFill } from "react-icons/ri";
import { useDispatch } from "react-redux";

interface Props {
  pageData: PageResponse<CartResponse>;
}

const CartComponent = (props: Props) => {
  const { pageData } = props;
  const products = pageData.data;
  const dispatch = useDispatch();
  return (
    <Card
      title={
        <div className="row">
          <div className="col">
            <Typography.Title level={5}>
              You have {products.length} items in your cart
            </Typography.Title>
          </div>
          <div className="col text-right"></div>
        </div>
      }
      style={{ minWidth: "400px" }}
    >
      <List
        itemLayout="horizontal"
        dataSource={products}
        renderItem={(item, index) => (
          <List.Item
            extra={
                <Button onClick={(e)=>{
                  e.preventDefault();
                  dispatch(removeProduct(item))
                    
                }} type={'text'} icon={<RiDeleteBinFill className="text-danger" size={20}/>}></Button>
            }
          >
            <List.Item.Meta

              avatar={
                <Avatar
                style={{borderRadius: 0}}
                size={50}
                shape="square"
                  src={item.imageUrl}
                />
              }
              title={<a>{item.title}</a>}
              
              description={
                <Space>
                    {
                        item.subProductResponse &&item.subProductResponse.options && Object.keys(item.subProductResponse.options).length >0 &&
                        Object.entries(item.subProductResponse.options).map(([key, value])=>
                            <span key={item.subProductId + key + value}>
                                <Typography.Text style={{fontWeight: '400'}}>{key}{': '}</Typography.Text>
                                {value as string}
                            </span>
                        )
                    }
                   
                </Space>
              }
            />
          </List.Item>
        )}
      />

      <div>
        <Button style={{ width: "100%" }} type="primary"  size="large">
          View all cart
        </Button>
      </div>
    </Card>
  );
};

export default CartComponent;
