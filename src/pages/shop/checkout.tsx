import handleAPI from "@/apis/handleAPI";
import { API, APP } from "@/configurations/configurations";
import { CustomAxiosResponse } from "@/model/AxiosModel";
import { CartResponse } from "@/model/CartModel";
import { FormatCurrency } from "@/utils/formatNumber";
import { Avatar, List, Space, Table, Typography } from "antd";
import { ColumnProps } from "antd/es/table";
import axios from "axios";
import { GetServerSideProps, GetStaticProps } from "next";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const Checkout = () => {
  const params = useSearchParams();
  const ids = params.get("ids");
  const isInitialLoad = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CartResponse[]>([]);

  useEffect(() => {
    if (isInitialLoad.current && ids) {
      getCarts();
      isInitialLoad.current = false;
    }
  }, [ids]);

  const getCarts = async () => {
    setIsLoading(true);
    try {
      const res = await handleAPI(`${API.CARTS}/to-payment?ids=${ids}`);
      setData(res.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {}, [data]);

  const columns: ColumnProps<CartResponse>[] = [
    {
      key: "index",
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
                    <Space key={item.id + key + value}>
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
    <div className="container">
      <div>
        <Typography.Title>Checkout</Typography.Title>
        <div className="row">
          <div className="col-sm-12 col-md-8">
            <Table
              style={{ padding: 0, margin: 0 }}
              scroll={{ x: "100%" }}
              pagination={false}
              dataSource={data}
              columns={columns}
            ></Table>
          </div>
          <div className="col"></div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
