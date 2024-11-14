import { ProductResponse } from "@/model/ProductModel";
import { SubProductResponse } from "@/model/SubProduct";
import { isMapsOptionsEqual } from "@/utils/compare";
import { Button, Modal, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import ProductDetail from "./../pages/products/[productId]/[slug]/index";
import handleAPI from "@/apis/handleAPI";
import { API } from "@/configurations/configurations";
import { CustomAxiosResponse } from "@/model/AxiosModel";
import { CartResponse } from "@/model/CartModel";
import { MdAdd, MdOutlineRemove } from "react-icons/md";
import { IoMdHeart } from "react-icons/io";
import { PageResponse } from "@/model/AppModel";
import { useDispatch, useSelector } from "react-redux";
import { cartSelector } from "@/reducx/reducers/cartReducer";
import { FormatCurrency } from "@/utils/formatNumber";
import { authSelector } from "@/reducx/reducers/authReducer";
import { useRouter } from "next/router";

interface Props {
  isVisible: boolean;
  initData?: any;
  onChange: () => void;
  onClose?: () => void;
  productId: string;
  type: "change" | "main";
  initCount?: number;
  subProductId?: string;
  onChangeProductDetail?: () => void;
}

const ChangeSubProduct = (props: Props) => {
  const {
    onChange,
    productId,
    type,
    initCount,
    subProductId,
    initData,
    isVisible,
    onClose,
  } = props;
  const [optionSelected, setOptionSelected] = useState<Map<string, string>>(
    new Map()
  );
  const [productDetail, setProductDetail] = useState<SubProductResponse[]>([]);

  const cart: PageResponse<CartResponse> = useSelector(cartSelector);
  const [count, setCount] = useState(initCount ?? 1);
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const router = useRouter();
  const [ isLoading, setIsLoading ] = useState(false);
  const [product, setProduct] = useState<ProductResponse>();
  const [photoSelected, setPhotoSelected] = useState(
    product && product.images && product.images.length > 0
      ? product.images[0]
      : "https://th.bing.com/th/id/R.b16b871600d4270d75d30babff3507d6?rik=jsJKr9%2bb8%2fuIzQ&pid=ImgRaw&r=0"
  );
  const [subProductSelected, setSubProductSelected] =
    useState<SubProductResponse>();

  useEffect(() => {
    if (initData) {
    } else if (productId) {
      getProduct(productId);
      getSubProducts(productId);
    }
  }, [initData, productId]);

  useEffect(() => {
    if (subProductId && productDetail && productDetail.length > 0) {
      const initSub = productDetail.find((el) => el.id === subProductId);
      console.log(initSub);
      if (initSub) {
        setOptions(initSub);
        initCount && setCount(initCount);
      }
    }
  }, [productDetail, subProductId, initCount]);

  useEffect(() => {
    if (product) {
      getListOptions(product);
      !subProductId && setInitOptions();
    }
  }, [product]);

  const getSubProducts = async (id: string) => {
    try {
      const res: CustomAxiosResponse<SubProductResponse[]> = await handleAPI(
        API.PRODUCT_DETAIL(id),
        "get"
      );
      setProductDetail(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const getProduct = async (id: string) => {
    try {
      const res: CustomAxiosResponse<ProductResponse> = await handleAPI(
        `${API.PRODUCTS}/${id}`,
        "get"
      );
      setProduct(res.data.result);
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    if (optionSelected && optionSelected.size > 0) {
      for (const sub of productDetail) {
        if (sub.options && Object.keys(sub.options).length > 0) {
          const map: Map<string, string> = new Map();
          Object.entries(sub.options).forEach(([key, value]) => {
            if (typeof value === "string") map.set(key, value);
          });
          if (isMapsOptionsEqual(map, optionSelected)) {
            setSubProductSelected(sub);
            if (sub.images && sub.images.length > 0) {
              setPhotoSelected(sub.images[0]);
            }
            break;
          }
        }
      }
    }
  }, [optionSelected]);

  const setInitOptions = () => {
    if (productDetail && productDetail.length > 0) {
      productDetail.forEach((sub) => {
        if (sub.quantity > 0) {
          setOptions(sub);
          return;
        }
      });
    }
  };

  const setOptions = (sub: SubProductResponse) => {
    if (sub.options && Object.keys(sub.options).length > 0) {
      const map: Map<string, string> = new Map();
      Object.entries(sub.options).forEach(([key, value]) => {
        if (typeof value === "string") map.set(key, value);
      });
      setOptionSelected(map);
    }
  };

  const [listOptions, setListOptions] = useState<Map<string, Set<string>>>();

  const getListOptions = (product: ProductResponse) => {
    const map: Map<string, Set<string>> = new Map();
    if (product.options && product.options.length > 0) {
      product.options.forEach((option) => map.set(option, new Set()));
    }
    productDetail.forEach((subPro) => {
      if (
        subPro.options &&
        typeof subPro.options === "object" &&
        !Array.isArray(subPro.options)
      ) {
        Object.entries(subPro.options).forEach(([key, value]) => {
          if (typeof value === "string") {
            const optionSet = map.get(key);
            if (optionSet) {
              optionSet.add(value);
            }
          } else {
            console.warn(`Invalid value for key "${key}":`, value);
          }
        });
      } else {
        console.warn("subPro.options is not an object:", subPro.options);
      }
    });
    setListOptions(map);
  };

  const handleSubmit = () => {
    

    if(subProductSelected && subProductId){
      if (type === "change") {
        if(subProductSelected.id === subProductId && count === initCount){
          console.log('Ko co thay doi');
          return;
        }else if(subProductSelected.id === subProductId){
          //Update count

        }else{
          //Change
          
        }
      } else if (type === "main") {
  
      }
    }
  };

  const renderButtonGroup = () => {
    let item: CartResponse | undefined = cart.data.find(
      (ele) => ele.subProductId === subProductSelected?.id
    );
    return (
      subProductSelected && (
        <Space className="mt-3">
          {type === "main" ? (
            <Typography.Title level={5} type="secondary">
              {"Available: "}
              {item
                ? subProductSelected.quantity - item.count
                : subProductSelected.quantity}
            </Typography.Title>
          ) : (
            <Typography.Title level={5} type="secondary">
              {"Quantity: "}
              {subProductSelected.quantity}
            </Typography.Title>
          )}
          <div
            style={{
              border: "1px solid silver",
              borderRadius: 6,
              padding: "5px 8px",
            }}
          >
            <button
              id="btn-des"
              onClick={() => setCount(count - 1)}
              disabled={count <= 1}
            >
              <MdOutlineRemove />
            </button>
            <Typography.Text
              style={{ fontWeight: "bold" }}
              className="ml-3 mr-3"
            >
              {count}
            </Typography.Text>
            <button
              id="btn-asc"
              onClick={() => setCount(count + 1)}
              disabled={
                type === "main"
                ? item
                  ? count >= subProductSelected.quantity - item.count
                  : count >= subProductSelected.quantity
                : count >= subProductSelected.quantity
              }
            >
              <MdAdd />
            </button>
          </div>
          <Button
            onClick={() => handleSubmit()}
            type="primary"
            disabled={
              type === "main"
                ? item
                  ? count > subProductSelected.quantity - item.count
                  : count > subProductSelected.quantity
                : count > subProductSelected.quantity
            }
          >
            {type === "main" ? "Add to cart" : "Change"}
          </Button>
          <Button style={{ color: "silver" }} icon={<IoMdHeart size={20} />} />
        </Space>
      )
    );
  };

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Modal open={isVisible} onCancel={handleClose} footer={false}>
      <div>
        {productId && product && type === "change" && (
          <div>
            <Typography.Title level={4}>{product.title}</Typography.Title>
            <div className="d-flex" style={{ alignItems: "center" }}>
              <div className="">
                <img
                  src={photoSelected}
                  style={{ objectFit: "cover" }}
                  alt=""
                  width={80}
                  height={85}
                />
              </div>
              {subProductSelected && (
                <div className="ml-2">
                  {subProductSelected.discount && subProductSelected.price ? (
                    <Space>
                      <Typography.Title level={5}>
                        {FormatCurrency.VND.format(subProductSelected.discount)}
                      </Typography.Title>
                      <Typography.Title type="secondary" level={5}>
                        <del>
                          {" "}
                          {FormatCurrency.VND.format(subProductSelected.price)}
                        </del>
                      </Typography.Title>
                    </Space>
                  ) : (
                    <Typography.Title level={5}>
                      {FormatCurrency.VND.format(subProductSelected.price)}
                    </Typography.Title>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {listOptions &&
          productDetail &&
          Array.from(listOptions.entries()).map(([key, valuesSet]) => (
            <div key={key}>
              <Typography.Title className="mb-2 mt-2" level={5}>
                {key}
              </Typography.Title>
              {Array.from(valuesSet).map((value) => {
                let isDisabled = true;
                // Duyệt qua từng sản phẩm
                for (let i = 0; i < productDetail.length; i++) {
                  const sub = productDetail[i];
                  // Bước 1: Kiểm tra xem sản phẩm có tùy chọn không
                  if (!sub.options) {
                    continue; // Nếu không có tùy chọn thì bỏ qua sản phẩm này
                  }
                  // Bước 2: Kiểm tra nếu sản phẩm có giá trị khớp với `key` và `value`
                  if (sub.options[key] !== value) {
                    continue; // Nếu không khớp với `size`, bỏ qua sản phẩm này
                  }

                  // Bước 3: Kiểm tra tất cả các tùy chọn đã chọn có khớp với sản phẩm
                  let allOptionsValid = true;
                  for (let [optKey, optValue] of optionSelected) {
                    // Nếu `optKey` không phải là `key`, kiểm tra xem giá trị có khớp không
                    if (optKey !== key && sub.options[optKey] !== optValue) {
                      allOptionsValid = false;
                      break; // Nếu có một tùy chọn không hợp lệ thì dừng kiểm tra
                    }
                  }

                  // Bước 4: Nếu tất cả các tùy chọn khớp, sản phẩm này hợp lệ
                  if (allOptionsValid) {
                    isDisabled = false; // Sản phẩm hợp lệ, cho phép nhấn nút
                    break; // Dừng kiểm tra sau khi tìm thấy sản phẩm hợp lệ đầu tiên
                  }
                }

                return (
                  <Button
                    type={
                      optionSelected.get(key) === value ? "primary" : "default"
                    }
                    onClick={() => {
                      const newMap = new Map(optionSelected);
                      newMap.set(key, value);
                      setOptionSelected(newMap);
                    }}
                    className="p-1 mr-1"
                    key={value}
                    disabled={isDisabled}
                  >
                    {key === "Color" && (
                      <div
                        style={{
                          border: "1px solid silver",
                          backgroundColor: value,
                          borderRadius: 100,
                          width: 20,
                          height: 20,
                        }}
                      ></div>
                    )}
                    {value}
                  </Button>
                );
              })}
            </div>
          ))}
        {renderButtonGroup()}
      </div>
    </Modal>
  );
};

export default ChangeSubProduct;
