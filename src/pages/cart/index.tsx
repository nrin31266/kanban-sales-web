import { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Button,
  Divider,
  List,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { CartResponse } from "@/model/CartModel";
import { CustomAxiosResponse } from "@/model/AxiosModel";
import { PageResponse } from "@/model/AppModel";
import { API } from "@/configurations/configurations";
import handleAPI from "@/apis/handleAPI";
import { BiSolidDownArrow } from "react-icons/bi";
import ChangeSubProduct from "@/components/ChangeSubProduct";
import { SubProductResponse } from "@/model/SubProduct";
import { ProductResponse } from "@/model/ProductModel";
import { FormatCurrency } from "@/utils/formatNumber";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { removeProduct } from "@/reducx/reducers/cartReducer";

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CartResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const page = useRef(1); // Dùng useRef để giữ giá trị page mà không render lại component
  const [isVisibleChangeSub, setIsVisibleChangeSub] = useState(false);
  const [itemSelected, setItemSelected] = useState<CartResponse>();
  const dispatch = useDispatch();
  const router = useRouter();

  const loadMoreData = async () => {
    if (loading) return;

    setLoading(true);
    const api = `${API.CARTS}?page=${page.current}&size=5`;
    try {
      const res: CustomAxiosResponse<PageResponse<CartResponse>> =
        await handleAPI(api);

      // Cập nhật tổng số phần tử và thêm dữ liệu mới vào state
      setTotalElements(res.data.result.totalElements);
      setData((prevData) => [...prevData, ...res.data.result.data]);

      // Tăng page sau mỗi lần tải dữ liệu mới
      page.current += 1;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoreData();
  }, []); // Chỉ gọi 1 lần khi component mount

  const loadNextPage = () => {
    loadMoreData(); // Gọi hàm loadMoreData khi kéo xuống cuối
  };

  return (
    <div className="container bg-white p-0" style={{}}>
      <div
        className="mt-3"
        id="scrollableDiv"
        style={{
          height: "80vh",
          overflow: "auto",
          padding: "0 8px",
          border: "1px solid rgba(140, 140, 140, 0.35)",
          width: "100%",
        }}
      >
        <InfiniteScroll
          dataLength={data.length}
          next={loadNextPage}
          hasMore={data.length < totalElements}
          loader={<Skeleton avatar paragraph={{ rows: 2 }} active />}
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={data}
            renderItem={(item) => (
              <List.Item key={item.id} className="cart row">
                <div
                  className="col-sm-12 col-md-7 d-flex"
                  style={{ alignItems: "center" }}
                >
                  <div>
                    <Avatar shape="square" size={120} src={item.imageUrl} />
                  </div>
                  <div className="row">
                    <div className="cart-item-title col-sm-12 col-md-8">
                      <a href="#">{item.title}</a>
                    </div>
                    <div className="col">
                      <Tag className="cart-item-option mt-2">
                        <a
                          onClick={() => {
                            setItemSelected(item);
                            setIsVisibleChangeSub(true);
                          }}
                        >
                          <div>
                            {"Classification: "}
                            <BiSolidDownArrow size={10} />
                          </div>
                          <Space>
                            {item.subProductResponse &&
                              item.subProductResponse.options &&
                              Object.keys(item.subProductResponse.options)
                                .length > 0 &&
                              Object.entries(
                                item.subProductResponse.options
                              ).map(([key, value]) => {
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
                                        <span style={{ opacity: 0.6 }}>
                                          {value}
                                        </span>
                                      )}
                                    </Space>
                                  )
                                );
                              })}
                          </Space>
                        </a>
                      </Tag>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-5 d-flex" style={{ justifyItems: "center" }}>
                  <div className="row" style={{width: '100%'}}>
                    <div className="col-7" style={{paddingRight: 0}}>
                      {item.subProductResponse &&
                      item.subProductResponse.discount &&
                      item.subProductResponse.price ? (
                        <Space>
                          <Typography.Text>
                            {FormatCurrency.VND.format(
                              item.subProductResponse.discount
                            )}
                          </Typography.Text>
                          <Typography.Text type="secondary" >
                            <del>
                              {" "}
                              {FormatCurrency.VND.format(
                                item.subProductResponse.price
                              )}
                            </del>
                          </Typography.Text>
                        </Space>
                      ) : (
                        item.subProductResponse && (
                          <Typography.Text >
                            {FormatCurrency.VND.format(
                              item.subProductResponse.price
                            )}
                          </Typography.Text>
                        )
                      )}
                    </div>
                    <div className="col">
                      <Typography.Text style={{fontWeight: 'bold'}}>
                        {"x"}
                        {item.count}
                      </Typography.Text>
                    </div>
                    <div className="col">
                      <a onClick={()=>{
                        dispatch(removeProduct(item));
                      }}><span className="text-danger"><u>Remove</u></span></a>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
      {itemSelected && itemSelected.productResponse && (
        <ChangeSubProduct
          isVisible={isVisibleChangeSub}
          type="change"
          initCount={itemSelected.count}
          initProduct={itemSelected.productResponse}
          onChange={() => {}}
          onClose={() => {
            setIsVisibleChangeSub(false);
          }}
          subProductId={itemSelected.subProductId}
        />
      )}
    </div>
  );
};

export default Cart;
