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
  Card,
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
import { IoMdArrowDropright } from "react-icons/io";
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
      return res.data.result;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeItem = async (itemReceived: CartRequest) => {
    console.log(itemReceived);
    if (itemSelected) {
      setLoading(true);
      try {
        if (
          itemReceived.subProductId === itemSelected.subProductId &&
          itemReceived.count === itemSelected.count
        ) {
          return; // Không có gì thay đổi
        } else if (itemReceived.subProductId === itemSelected.subProductId) {
          // Cập nhật sản phẩm trong giỏ
          await updateCart(itemReceived);

          const indexItem = data.findIndex(
            (ele) => ele.subProductId === itemReceived.subProductId
          );
          if (indexItem !== -1) {
            const updatedData = [...data];
            updatedData[indexItem] = {
              ...updatedData[indexItem],
              count: itemReceived.count,
            };
            setData(updatedData);
          }
        } else {
          // Xử lý trường hợp sản phẩm khác
          const indexItem = data.findIndex(
            (ele) => ele.subProductId === itemReceived.subProductId
          );

          if (indexItem === -1) {
            // Thêm sản phẩm vào giỏ
            const result: CartResponse = await addCart(itemReceived);
            setData((prevData) => [result, ...prevData]); // Cập nhật danh sách giỏ hàng
            dispatch(addProduct(result));
          } else {
            // Nếu đã có, cập nhật số lượng
            const updatedData = [...data];
            updatedData[indexItem] = {
              ...updatedData[indexItem],
              count: updatedData[indexItem].count + itemReceived.count,
            };
            setData(updatedData);
            await addCart(itemReceived);
          }
        }

        // Thêm ID sản phẩm vào danh sách đã chọn
        if (!itemsIdSelected.has(itemReceived.subProductId)) {
          addItemId(itemReceived.subProductId);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Dừng trạng thái loading
      }
    }
  };

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

  const buildCartRequest = (item: CartResponse) => {
    const r: CartRequest = {
      count: item.count,
      createdBy: item.createdBy,
      imageUrl: item.imageUrl,
      productId: item.productId,
      subProductId: item.subProductId,
      title: item.title,
    };
    return r;
  };

  const updateCount = async (item: CartRequest) => {
    setLoading(true);
    try {
      const res: CartResponse = await updateCart(item);
      const indexItem = data.findIndex(
        (ele) => ele.subProductId === res.subProductId
      );
      if (indexItem !== -1) {
        const updatedData = [...data];
        updatedData[indexItem] = {
          ...updatedData[indexItem],
          count: res.count,
        };
        setData(updatedData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container bg-white" style={{}}>
        <div className="" style={{}}>
          <Typography.Title level={2}>Cart</Typography.Title>
        </div>
        <div
          className=""
          id="scrollableDiv"
          style={{
            height: "80vh",
            overflow: "auto",
            padding: "8px 8px",
            border: "1px solid rgba(140, 140, 140, 0.35)",
            width: "100%",
          }}
        >
          <InfiniteScroll
            dataLength={data.length}
            next={loadNextPage}
            hasMore={data.length < totalElements && !loading}
            loader={
              <div>
                <Skeleton avatar paragraph={{ rows: 2 }} active />
                <Skeleton avatar paragraph={{ rows: 2 }} active />
                <Skeleton avatar paragraph={{ rows: 2 }} active />
              </div>
            }
            endMessage={<Divider plain>It is all, nothing more</Divider>}
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
                  <div className="col-sm-12 col-md-6" style={{}}>
                    <div className="row" style={{ width: "100%" }}>
                      <div
                        className="col-10 d-flex"
                        style={{ alignItems: "center" }}
                      >
                        <div
                          className="mr-2"
                          style={{
                            border: "1px solid silver",
                            width: "max-content",
                            display: "flex",
                            alignItems: "center",
                            padding: 4,
                            borderRadius: 6,
                          }}
                        >
                          <Button
                            disabled={loading ? loading : item.count <= 1}
                            icon={<MdOutlineRemove size={20} />}
                            onClick={() => {
                              updateCount(
                                buildCartRequest({
                                  ...item,
                                  count: item.count - 1,
                                })
                              );
                            }}
                          ></Button>
                          <Typography.Text
                            style={{
                              fontWeight: "bold",
                              marginLeft: "0.5rem",
                              marginRight: "0.5rem",
                            }}
                          >
                            {"x"}
                            {item.count}
                          </Typography.Text>
                          <Button
                            disabled={
                              loading
                                ? loading
                                : item.subProductResponse &&
                                  item.subProductResponse?.quantity <= 100
                                ? item.count >=
                                  item.subProductResponse?.quantity
                                : item.count >= 100
                            }
                            icon={<MdAdd size={20} />}
                            onClick={() => {
                              updateCount(
                                buildCartRequest({
                                  ...item,
                                  count: item.count + 1,
                                })
                              );
                            }}
                          ></Button>
                        </div>
                        {item.subProductResponse && (
                          <div className="" style={{ display: "" }}>
                            {item.subProductResponse.discount &&
                            item.subProductResponse.price ? (
                              <div style={{}} className="d-flex">
                                <div style={{ fontWeight: "bold" }}>
                                  {FormatCurrency.VND.format(
                                    item.subProductResponse.discount
                                  )}
                                </div>
                                <div style={{ opacity: "0.5" }}>
                                  &nbsp;
                                  <del>
                                    {FormatCurrency.VND.format(
                                      item.subProductResponse.price
                                    )}
                                  </del>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div style={{ fontWeight: "bold" }}>
                                  {FormatCurrency.VND.format(
                                    item.subProductResponse.price
                                  )}
                                </div>
                              </div>
                            )}
                            <div
                              style={{
                                fontWeight: "bold",
                                color: "#108ab1",
                                alignContent: "center",
                              }}
                              className="d-flex"
                            >
                              <IoMdArrowDropright size={20} />
                              {FormatCurrency.VND.format(
                                item.subProductResponse.discount
                                  ? item.subProductResponse.discount *
                                      item.count
                                  : item.subProductResponse.price * item.count
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div
                        style={{ alignItems: "center" }}
                        className="col-2 d-flex"
                      >
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
            padding: 8,
            // backgroundColor: "#e7f5dc",
          }}
        >
          <div className="row">
            <div className="col"></div>
            <div className="col">
              <div className="text-right">
                <Button
                  style={{ height: "100%" }}
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
