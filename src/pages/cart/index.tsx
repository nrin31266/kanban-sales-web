import handleAPI from "@/apis/handleAPI";
import ChangeSubProduct from "@/components/ChangeSubProduct";
import { API, PAGE } from "@/configurations/configurations";
import { PageResponse } from "@/model/AppModel";
import { CustomAxiosResponse } from "@/model/AxiosModel";
import { CartRequest, CartResponse } from "@/model/CartModel";
import { addProduct, removeProduct } from "@/reducx/reducers/cartReducer";
import { FormatCurrency } from "@/utils/formatNumber";
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  List,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BiSolidDownArrow } from "react-icons/bi";
import { MdAdd, MdOutlineRemove } from "react-icons/md";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CartResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const page = useRef(1); // Dùng useRef để giữ giá trị page mà không render lại component
  const [isVisibleChangeSub, setIsVisibleChangeSub] = useState(false);
  const [itemSelected, setItemSelected] = useState<CartResponse>();
  const dispatch = useDispatch();
  const isInitialLoad = useRef(true); // Biến kiểm tra lần đầu tải
  const [itemsIdSelected, setItemsIdSelected] = useState<Set<string>>(
    new Set()
  );
  const router = useRouter();

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
        if (itemsIdSelected.has(itemToRemove.subProductId)) {
          changeItemsId(itemToRemove.subProductId);
        }
        // Nếu số lượng phần tử hiện tại ít hơn totalElements, gọi API để tải thêm
        if (data.length < totalElements) {
          getCartAdditional();
        }
        //đồng bộ reducer
        dispatch(removeProduct(itemToRemove));
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
        const indexItem = data.findIndex(
          (ele) => ele.subProductId === itemReceived.subProductId
        );

        if (indexItem === -1) {
          // Có thể ko có thật
          //Hoặc có thể chưa load
          addCart(itemReceived) // Thêm sản phẩm vào giỏ
            .then((result: CartResponse) => {
              setData((prevData) => [result, ...prevData]); // Cập nhật danh sách giỏ hàng
              dispatch(addProduct(result));
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
          addCart(itemReceived);
          // handleRemoveItem(item);
        }
      }
      if (!itemsIdSelected.has(itemReceived.subProductId)) {
        addItemId(itemReceived.subProductId);
      }
    }
  };

  // console.log(totalElements, data.length);

  const changeItemsId = (id: string) => {
    setItemsIdSelected((pre) => {
      const newIds: Set<string> = new Set(pre);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  };

  const addItemId = (id: string) => {
    setItemsIdSelected((pre) => {
      const newIds: Set<string> = new Set(pre);
      newIds.add(id);
      return newIds;
    });
  };

  useEffect(() => {
    console.log(itemsIdSelected);
  }, [itemsIdSelected]);

  return (
    <>
      <div className="container bg-white p-0" style={{}}>
        <div style={{ backgroundColor: "GrayText" }}>
          <Typography.Title level={2}>Cart</Typography.Title>
        </div>
        <div
          className="mt-3"
          id="scrollableDiv"
          style={{
            height: "80vh",
            overflow: "auto",
            padding: "0 8px",
            // border: "1px solid rgba(140, 140, 140, 0.35)",
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
              style={{ overflowX: "hidden" }}
              dataSource={data}
              renderItem={(item) => (
                <List.Item
                  style={
                    {
                      // backgroundColor: itemsIdSelected.has(item.subProductId)
                      //   ? "rgb(106, 219, 185, 0.1)"
                      //   : "",
                    }
                  }
                  key={item.id}
                  className="cart row"
                >
                  <div
                    className="col-sm-12 col-md-6 d-flex"
                    style={{ alignItems: "center" }}
                  >
                    <div>
                      <Checkbox
                        checked={itemsIdSelected.has(item.subProductId)}
                        onClick={() => changeItemsId(item.subProductId)}
                      />
                    </div>
                    <div className="ml-2">
                      <Avatar shape="square" size={120} src={item.imageUrl} />
                    </div>
                    <div>
                      <div className="cart-item-title">
                        <Link
                          href={`${PAGE.PRODUCTS}/${item.productId}/${item.productResponse?.slug}`}
                        >
                          {item.title}
                        </Link>
                      </div>
                      <div>
                        <a
                          onClick={() => {
                            setItemSelected(item);
                            setIsVisibleChangeSub(true);
                          }}
                        >
                          <div
                            style={{
                              border: "1px solid silver",
                              backgroundColor: "rgb(232, 232, 232, 0.6)",
                              padding: 4,
                              borderRadius: 4,
                              width: "max-content",
                              maxWidth: "",
                            }}
                            className="cart-item-option mt-2"
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
                                      <div
                                        style={{ display: "flex" }}
                                        key={item.id + key + value}
                                      >
                                        <div>
                                          {key}
                                          {":"}&nbsp;
                                        </div>
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
                                          <div style={{ opacity: 0.6 }}>
                                            {value}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  );
                                })}
                            </Space>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-sm-12 col-md-6 d-flex"
                    style={{ justifyItems: "center" }}
                  >
                    <div className="row" style={{ width: "100%" }}>
                      <div className="col-6" style={{ paddingRight: 4}}>
                        {item.subProductResponse &&
                        item.subProductResponse.discount &&
                        item.subProductResponse.price ? (
                          <Space >
                            <Typography.Text style={{fontWeight: 'bold'}}>
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
                            <Typography.Text  style={{fontWeight: 'bold'}}>
                              {FormatCurrency.VND.format(
                                item.subProductResponse.price
                              )}
                            </Typography.Text>
                          )
                        )}
                      </div>
                      <div className="col-4 d-flex" style={{justifyContent: 'center'}}>
                        <div style={{border: '1px solid silver', width: 'max-content', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 6}}>
                          <Button disabled={item.count <= 1} icon={<MdOutlineRemove size={20} />}></Button>
                          <Typography.Text style={{ fontWeight: "bold", marginLeft: '0.5rem',marginRight: '0.5rem',}}>
                            {"x"}
                            {item.count}
                          </Typography.Text>
                          <Button disabled={item.subProductResponse&& item.subProductResponse?.quantity <= 100 ? item.count >= item.subProductResponse?.quantity  : item.count >=100} icon={<MdAdd size={20} />}></Button>
                        </div>
                      </div>
                      <div className="col-2">
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
        <div
          style={{
            width: "100%",
            height: "7vh",
            backgroundColor: "#e0e0e0",
          }}
        >
          <div className="row">
            <div className="col"></div>
            <div className="col">
              <Button
                onClick={() => {
                  if (itemsIdSelected.size > 0) {
                    const idArray = Array.from(itemsIdSelected); // Chuyển Set thành Array
                    const idString = idArray.join(","); // Chuyển Array thành chuỗi
                    router.push(`/shop/checkout?ids=${idString}`);
                  }
                }}
                type="primary"
                size="large"
              >
                Checkout
              </Button>
            </div>
          </div>
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
    </>
  );
};

export default Cart;
