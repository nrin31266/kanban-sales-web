import { CartResponse } from "@/model/CartModel";
import { OrderProductResponse } from "@/model/PaymentModel";
import { FormatCurrency } from "@/utils/formatNumber";
import { Avatar, Space, Table, Typography } from "antd";
import { ColumnProps } from "antd/es/table";
import React from "react";

interface Props {
  data: OrderProductResponse[];
}

const OrderTable = (props: Props) => {
  const { data } = props;
  const columns: ColumnProps<OrderProductResponse>[] = [
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
      dataIndex: "name",
      render: (name) => <Typography.Text>{name}</Typography.Text>,
      width: 200
    },
    {
      key: "option",
      dataIndex: "options",
      render: (options: any) => (
        <Space>
          {options &&
            Object.keys(options).length > 0 &&
            Object.entries(options).map(([key, value]) => {
              return (
                typeof value === "string" && (
                  <Space key={`${key}-${key}`}>
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
                          borderRadius: 4,
                          border: "1px solid silver",
                        }}
                      ></div>
                    ) : (
                      <span style={{ opacity: 0.6 }}>{value}</span>
                    )}
                  </Space>
                )
              );
            })}
        </Space>
      ),
      title: "options",
      width: 200
    },
    {
      key: "price",
      dataIndex: "price",
      render: (price: number) => (
        <Typography.Text>{FormatCurrency.VND.format(price)}</Typography.Text>
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
      render: (item: OrderProductResponse) =>
        <Typography.Text>{FormatCurrency.VND.format(item.price * item.count)}</Typography.Text>,
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

export default OrderTable;
