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
import { CartRequest, CartResponse } from "@/model/CartModel";
import { CustomAxiosResponse } from "@/model/AxiosModel";
import { PageResponse } from "@/model/AppModel";
import { API, PAGE } from "@/configurations/configurations";
import handleAPI from "@/apis/handleAPI";
import { BiSolidDownArrow } from "react-icons/bi";
import ChangeSubProduct from "@/components/ChangeSubProduct";
import { SubProductResponse } from "@/model/SubProduct";
import { ProductResponse } from "@/model/ProductModel";
import { FormatCurrency } from "@/utils/formatNumber";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { removeProduct } from "@/reducx/reducers/cartReducer";
import Link from "next/link";

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CartResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const page = useRef(1); // Dùng useRef để giữ giá trị page mà không render lại component
  const [isVisibleChangeSub, setIsVisibleChangeSub] = useState(false);
  const [itemSelected, setItemSelected] = useState<CartResponse>();
  const dispatch = useDispatch();
  const isInitialLoad = useRef(true); // Biến kiểm tra lần đầu tải

  const loadMoreData = async () => {
    if (loading) return;

    setLoading(true); // Bắt đầu tải dữ liệu
    const api = `${API.CARTS}?page=${page.current}&size=9`;
    try {
      const res: CustomAxiosResponse<PageResponse<CartResponse>> =
        await handleAPI(api);

      setTotalElements(res.data.result.totalElements); // Cập nhật tổng số phần tử
      setData((prevData) => [...prevData, ...res.data.result.data]); // Thêm dữ liệu mới vào state

      page.current += 1; // Tăng page sau mỗi lần tải
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Kết thúc tải dữ liệu
    }
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false; // Đảm bảo chỉ gọi một lần khi component mount
      loadMoreData(); // Gọi API lần đầu tiên khi component mount
    }
  }, []); // Dependency rỗng chỉ gọi lần đầu tiên
  const loadNextPage = () => {
    loadMoreData(); // Gọi loadMoreData khi kéo xuống dưới
  };

  const getCartAdditional = async () => {
    setLoading(true);
    try {
      const res: CustomAxiosResponse<CartResponse> = await handleAPI(
        `${API.CARTS}/additional?page=${page.current - 1}&size=${9}`
      );
      setData((pre) => [...pre, res.data.result]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (itemToRemove: CartResponse) => {
    // Xóa mục khỏi backend
    removeCart(itemToRemove.subProductId, itemToRemove.createdBy)
      .then(() => {
        // Xóa mục khỏi state data sau khi xóa thành công
        setData((prevData) =>
          prevData.filter((item) => item.id !== itemToRemove.id)
        );
        setTotalElements((prevTotal) => prevTotal - 1);

        // Nếu số lượng phần tử hiện tại ít hơn totalElements, gọi API để tải thêm
        if (data.length < totalElements) {
          getCartAdditional();
        }
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
      });
  };

  const removeCart = async (subProductId: string, createdBy: string) => {
    setLoading(true);
    try {
      await handleAPI(
        `${API.CARTS}/${subProductId}/${createdBy}`,
        undefined,
        "delete"
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addCart = async (item: CartRequest) => {
    setLoading(true);
    try {
      const res = await handleAPI(API.CARTS, item, "post");
      return res.data.result;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateCart = async (item: CartRequest) => {
    setLoading(true);
    try {
      const res = await handleAPI(API.CARTS, item, "put");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeItem = (itemReceived: CartRequest) => {
    console.log(itemReceived);
    if (itemSelected) {
      if (
        itemReceived.subProductId === itemSelected.subProductId &&
        itemReceived.count === itemSelected.count
      ) {
        return;
      } else if (itemReceived.subProductId === itemSelected.subProductId) {
        updateCart(itemReceived)
          .then(() => {
            const indexItem = data.findIndex(
              (ele) => ele.subProductId === itemReceived.subProductId
            );
            if (indexItem != -1) {
              const updatedData = [...data];
              updatedData[indexItem] = {
                ...updatedData[indexItem],
                count: itemReceived.count,
              };
              setData(updatedData);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        const item: CartResponse = {
          productId: itemReceived.productId,
          count: itemReceived.count,
          createdAt: null,
          imageUrl: itemReceived.imageUrl,
          title: itemReceived.title,
          id: null,
          productResponse: null,
          subProductResponse: itemReceived.subProductResponse,
          updatedAt: null,
          subProductId: itemReceived.subProductId,
          createdBy: itemReceived.createdBy,
        };
        const indexItem = data.findIndex(
          (ele) => ele.subProductId === itemReceived.subProductId
        );

        if (indexItem === -1) {
          // Có thể ko có thật
          //Hoặc có thể chưa load
          addCart(itemReceived) // Thêm sản phẩm vào giỏ
          .then((result: CartResponse) => {
            setData((prevData) => [result, ...prevData]); // Cập nhật danh sách giỏ hàng
            console.log(data);
          })
          .catch((error) => {
            console.error(error);
          });
        } else {
          //Có thì dễ rồi cập nhập số lượng nó thôi
          //Và sẽ xóa nó ra theo hàm lúc trc
          const updatedData = [...data];
          updatedData[indexItem] = {
            ...updatedData[indexItem],
            count: updatedData[indexItem].count + itemReceived.count,
          };
          setData(updatedData);
          updateCart(itemReceived);
          handleRemoveItem(item);
        }
      }
    }
  };

  console.log(totalElements, data.length);

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
          hasMore={data.length < totalElements && !loading}
          loader={<Skeleton avatar paragraph={{ rows: 2 }} active />}
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
          initialScrollY={0}
          scrollThreshold={0.8}
        >
          <List
            // style={{overflowX: 'hidden',}}
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
                      <Link
                        href={`${PAGE.PRODUCTS}/${item.productId}/${item.productResponse?.slug}`}
                      >
                        {item.title}
                      </Link>
                    </div>
                    <div className="col">
                      <a
                        onClick={() => {
                          setItemSelected(item);
                          setIsVisibleChangeSub(true);
                        }}
                      >
                        <Tag className="cart-item-option mt-2">
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
                        </Tag>
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="col-sm-12 col-md-5 d-flex"
                  style={{ justifyItems: "center" }}
                >
                  <div className="row" style={{ width: "100%" }}>
                    <div className="col-7" style={{ paddingRight: 0 }}>
                      {item.subProductResponse &&
                      item.subProductResponse.discount &&
                      item.subProductResponse.price ? (
                        <Space>
                          <Typography.Text>
                            {FormatCurrency.VND.format(
                              item.subProductResponse.discount
                            )}
                          </Typography.Text>
                          <Typography.Text type="secondary">
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
                          <Typography.Text>
                            {FormatCurrency.VND.format(
                              item.subProductResponse.price
                            )}
                          </Typography.Text>
                        )
                      )}
                    </div>
                    <div className="col">
                      <Typography.Text style={{ fontWeight: "bold" }}>
                        {"x"}
                        {item.count}
                      </Typography.Text>
                    </div>
                    <div className="col">
                      <a
                        onClick={() => {
                          handleRemoveItem(item);
                        }}
                      >
                        <span className="text-danger">
                          <u>Remove</u>
                        </span>
                      </a>
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
          onChange={(cartRequest) => {
            handleChangeItem(cartRequest);
          }}
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
