import { ProductResponse } from "@/model/ProductModel";
import { SubProductResponse } from "@/model/SubProduct";
import { isMapsOptionsEqual } from "@/utils/compare";
import { Button, Flex, Modal, Space, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import ProductDetail from "./../pages/products/[productId]/[slug]/index";
import handleAPI from "@/apis/handleAPI";
import { API, PAGE } from "@/configurations/configurations";
import { CustomAxiosResponse } from "@/model/AxiosModel";
import { CartRequest, CartResponse } from "@/model/CartModel";
import { MdAdd, MdOutlineRemove } from "react-icons/md";
import { IoMdHeart } from "react-icons/io";
import { PageResponse } from "@/model/AppModel";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, cartSelector } from "@/reducx/reducers/cartReducer";
import { FormatCurrency } from "@/utils/formatNumber";
import { authSelector } from "@/reducx/reducers/authReducer";
import { useRouter } from "next/router";

interface Props {
  isVisible: boolean;
  initData?: { product: ProductResponse; subProducts: SubProductResponse[] };
  onChange?: (cart: CartRequest) => void;
  onClose?: () => void;
  productId?: string;
  type: "change" | "main";
  initCount?: number;
  subProductId?: string;
  onChangeProductDetail?: (
    subSelected: SubProductResponse,
    photoUrl: string
  ) => void;
  initProduct?:ProductResponse;
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
    onChangeProductDetail,
    initProduct,
  } = props;
  const [optionSelected, setOptionSelected] = useState<Map<string, string>>(
    new Map()
  );
  const [productDetail, setProductDetail] = useState<SubProductResponse[]>([]);

  // const cart: PageResponse<CartResponse> = useSelector(cartSelector);
  const [count, setCount] = useState(initCount ?? 1);
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<ProductResponse>();
  const [photoSelected, setPhotoSelected] = useState('');
  const [subProductSelected, setSubProductSelected] = useState<SubProductResponse>();

  useEffect(() => {
    if (initData) {
      setProduct(initData.product);
      setProductDetail(initData.subProducts);
    } else if (productId) {
      getProduct(productId);
    } else if (initProduct){
      console.log(initProduct);
      setProduct(initProduct)
    }
  }, [initData, subProductId]);

  useEffect(() => {
    if (product && productId) {
      getSubProducts(productId);
    }else if(initProduct){
      getSubProducts(initProduct.id);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      getListOptions(product);
      initData && setInitOptions();

      
      
    }
    if (subProductId && productDetail && productDetail.length > 0) {
      const initSub = productDetail.find((el) => el.id === subProductId);
      if (initSub) {
        setOptions(initSub);
        initCount && setCount(initCount);
      }
    }
  }, [productDetail]);

  useEffect(() => {
    if (subProductSelected && onChangeProductDetail) {
      onChangeProductDetail(subProductSelected, photoSelected);
    }
  }, [subProductSelected]);

  const getSubProducts = async (id: string) => {
    setIsLoading(true);
    try {
      const res: CustomAxiosResponse<SubProductResponse[]> = await handleAPI(
        API.PRODUCT_DETAIL(id),
        "get"
      );
      setProductDetail(res.data.result);
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
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
            }else if(product && product.images && product.images.length > 0){
              setPhotoSelected(product.images[0]);
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
    if (product && subProductSelected) {
      if (!auth.accessToken) {
        router.push(
          `${PAGE.LOGIN}?productId=${product.id}&slug=${product.slug}`
        );
        return;
      }

      const item: CartRequest = {
        count: count,
        createdBy: auth.userInfo.id,
        imageUrl:
          subProductSelected.images && subProductSelected.images.length > 0
            ? subProductSelected.images[0]
            : product.images[0],
        productId: product.id,
        subProductId: subProductSelected.id,
        subProductResponse: subProductSelected,
        title: product.title,
      };

      if (type === "change") {
        if (subProductSelected.id === subProductId && count === initCount) {
          console.log("Ko co thay doi");
          return;
        } else {
          onChange && onChange(item);
          onClose && onClose();
        }
      } else if (type === "main") {
        
        dispatch(addProduct(item));
        setCount(1);
      }
    }
  };

  const renderOptionsGroup = () =>{
    return <>
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
    </>
  }

  const renderButtonGroup = () => {
    return (
      subProductSelected && (
        <Space wrap className="mt-3">
          <Typography.Title level={5} type="secondary">
            {"Quantity: "}
            {subProductSelected.quantity}
          </Typography.Title>
          <div
            style={{
              border: "1px solid silver",
              borderRadius: 6,
              padding: "5px 8px",
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Button
              id="btn-des"
              onClick={() => setCount(count - 1)}
              disabled={count <= 1}
              icon={<MdOutlineRemove size={20}/>}
            >
              
            </Button>
            <Typography.Text
              style={{ fontWeight: "bold" }}
              className="ml-3 mr-3"
            >
              {count}
            </Typography.Text>
            <Button
              id="btn-asc"
              onClick={() => setCount(count + 1)}
              disabled={count >= subProductSelected.quantity}
              icon={<MdAdd size={20}/>}
            >
              
            </Button>
          </div>
          <Button
            onClick={() => handleSubmit()}
            type="primary"
            disabled={count > subProductSelected.quantity}
          >
            {type === "main" ? "Add to cart" : "Change"}
          </Button>
          <Button style={{ color: "silver" }} icon={<IoMdHeart size={20} />} />
        </Space>
      )
    );
  };

  const handleClose = () => {
    setPhotoSelected('');
    onClose && onClose();
  };

  return initData ? (
    <div>
      {product && type === "change" && (
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
      {renderOptionsGroup()}
      {renderButtonGroup()}
    </div>
  ) : (
    <Modal loading={isLoading} open={isVisible} onCancel={handleClose} footer={false}>
      <div>
        {(productId || initProduct) && product && type === "change" && (
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
        {renderOptionsGroup()}
        {renderButtonGroup()}
      </div>
    </Modal>
  );
};

export default ChangeSubProduct;
