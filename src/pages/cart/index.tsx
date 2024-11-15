import { useState, useEffect, useRef } from "react";
import { Avatar, Divider, List, Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { CartResponse } from "@/model/CartModel";
import { CustomAxiosResponse } from "@/model/AxiosModel";
import { PageResponse } from "@/model/AppModel";
import { API } from "@/configurations/configurations";
import handleAPI from "@/apis/handleAPI";

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CartResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const page = useRef(1);  // Dùng useRef để giữ giá trị page mà không render lại component

  const loadMoreData = async () => {
    if (loading) return;

    setLoading(true);
    const api = `${API.CARTS}?page=${page.current}&size=5`;
    try {
      const res: CustomAxiosResponse<PageResponse<CartResponse>> = await handleAPI(api);

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
    <div className="container bg-white">
      <div
        className="mt-3"
        id="scrollableDiv"
        style={{
          height: "800px",
          overflow: 'auto',
          padding: "0 16px",
          border: "1px solid rgba(140, 140, 140, 0.35)",
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
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={<Avatar shape="square" size={100} src={item.imageUrl} />}
                  title={<a href="#">{item.title}</a>}
                  description={""}
                />
                <div>Content</div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Cart;
