import { CartResponse } from "@/model/CartModel";
import { FormatCurrency } from "@/utils/formatNumber";
import { Avatar, Space, Table } from "antd";
import { ColumnProps } from "antd/es/table";
import React from "react";

interface Props {
  data: CartResponse[];
}

const CartTable = (props: Props) => {
  const { data } = props;
  const columns: ColumnProps<CartResponse>[] = [
    {
      key: "index-number",
      title: "#",
      render: (_, __, index) => index + 1,
    },
    {
      key: "image",
      dataIndex: "imageUrl",
      render: (img) => <Avatar shape="square" size={70} src={img} />,
    },
    {
      key: "title",
      dataIndex: "title",
      render: (title) => title,
    },
    {
      key: "option",
      dataIndex: "",
      render: (item: CartResponse) => (
        <div>
          {item &&
            item.subProductResponse &&
            item.subProductResponse.options &&
            Object.keys(item.subProductResponse.options).length > 0 &&
            Object.entries(item.subProductResponse.options).map(
              ([key, value]) => {
                return (
                  typeof value === "string" && (
                    <Space key={`${item.id}-${key}`}>
                      <span>
                        {key}
                        {": "}
                      </span>
                      {key === "Color" ? (
                        <div
                          style={{
                            backgroundColor: value,
                            width: 20,
                            height: 20,
                            borderRadius: 100,
                            border: "1px solid silver",
                          }}
                        ></div>
                      ) : (
                        <span style={{ opacity: 0.6 }}>{value}</span>
                      )}
                    </Space>
                  )
                );
              }
            )}
        </div>
      ),
      title: "options",
    },
    {
      key: "price",
      dataIndex: "",
      render: (item: CartResponse) =>
        item.subProductResponse &&
        FormatCurrency.VND.format(
          item.subProductResponse.discount
            ? item.subProductResponse.discount
            : item.subProductResponse.price
        ),
      title: "price",
    },
    {
      key: "count",
      dataIndex: "count",
      render: (count) => `x${count}`,
    },
    {
      key: "sub-price",
      dataIndex: "",
      render: (item: CartResponse) =>
        item.subProductResponse &&
        FormatCurrency.VND.format(
          item.subProductResponse.discount
            ? item.subProductResponse.discount * item.count
            : item.subProductResponse.price * item.count
        ),
      title: "sub price",
    },
  ];
  return (
    <Table
     dataSource={data.map((item) => ({ ...item, key: item.id }))}
      key={"cart-table"}
      style={{ padding: 0, margin: 0 }}
      scroll={{ x: "100%" }}
      pagination={false}
      columns={columns}
    ></Table>
  );
};

export default CartTable;
