import { CartResponse } from "@/model/CartModel";
import { removeProduct } from "@/reducx/reducers/cartReducer";
import { Avatar, Button, Card, List, Modal, Space, Typography } from "antd";
import React from "react";
import { RiDeleteBinFill } from "react-icons/ri";
import { useDispatch } from "react-redux";

interface Props {
  products: CartResponse[];
}

const CartComponent = (props: Props) => {
  const { products } = props;
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
                <Button onClick={()=>{
                    Modal.confirm({
                        onCancel: ()=>{},
                        onOk:()=>dispatch(removeProduct(item))
                    });
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
              title={<a href="https://ant.design">{'fafafa'}</a>}
              
              description={
                <Space>
                    {
                        item.options && Object.keys(item.options).length >0 &&
                        Object.entries(item.options).map(([key, value])=>
                            <span key={key+value}>
                                <Typography.Text style={{fontWeight: '400'}}>{key}{': '}</Typography.Text>
                                {value}
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
        <Button style={{ width: "100%" }}  size="large">
          View cart
        </Button>
        <Button
          className="mt-2"
          type="primary"
          size="large"
          style={{ width: "100%" }}
        >
          Check out
        </Button>
      </div>
    </Card>
  );
};

export default CartComponent;
