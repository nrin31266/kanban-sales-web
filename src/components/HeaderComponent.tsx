import { PAGE } from "@/configurations/configurations";
import { AuthModel } from "@/model/AuthenticationModel";

import { colors } from "@/constants/appInfos";
import { PageResponse } from "@/model/AppModel";
import { CartResponse } from "@/model/CartModel";
import { UserProfile } from "@/model/UserModel";
import { authSelector } from "@/reducx/reducers/authReducer";
import { cartSelector } from "@/reducx/reducers/cartReducer";
import { userProfileSelector } from "@/reducx/reducers/profileReducer";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Affix,
  Avatar,
  Badge,
  Button,
  Drawer,
  Dropdown,
  Input,
  Menu,
  Space,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { MenuProps } from "rc-menu";
import { useEffect, useState } from "react";
import { IoClose, IoNotificationsSharp } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import CartComponent from "./CartComponent";
import DrawerDownLeft from "./DrawerDownLeft";
import DrawerDownRight from "./DrawerDownRight";
import MainSearch from "./MainSearch";

type MenuItem = Required<MenuProps>["items"][number];

const HeaderComponent = () => {
  const auth: AuthModel = useSelector(authSelector);
  const pages = new Map<string, string>([
    ["home", PAGE.HOME],
    ["shop", PAGE.SHOP],
    ["cart", PAGE.CART],
  ]);
  const router = useRouter();
  const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);
  const cart: PageResponse<CartResponse> = useSelector(cartSelector);
  const dispatch = useDispatch();
  const [current, setCurrent] = useState("home");
  const [isCartDropDown, setIsCartDropDown] = useState(false);
  const [isVisibleDrawerRight, setIsVisibleDrawerRight] = useState(false);
  const userProfile: UserProfile = useSelector(userProfileSelector);
  const { Search } = Input;
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const currentPath = Array.from(pages.entries()).find(
      ([key, path]) => path === router.pathname
    )?.[0];
    if (currentPath) setCurrent(currentPath);
  });

  const onClick: MenuProps["onClick"] = (e) => {
    router.push(pages.get(e.key) as string);
  };

  const items: MenuItem[] = [
    {
      label: "Home",
      key: "home",
    },
    {
      label: "Shop",
      key: "shop",
    },
    {
      label: "Cart",
      key: "cart",
    },
  ];

  return (
    <Affix offsetTop={0}>
      <div className="header">
        <div style={{ backgroundColor: colors[1] }}>
          <div className="row" style={{ width: "100%" }}>
            <div
              className="col ml-4"
              style={{
                padding: "0.7rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Button
                className="d-block d-md-none"
                type="text"
                icon={
                  collapsed ? (
                    <MenuUnfoldOutlined
                      style={{ color: "white", fontSize: "20px" }}
                    />
                  ) : (
                    <MenuFoldOutlined
                      style={{ color: "white", fontSize: "20px" }}
                    />
                  )
                }
                onClick={() => setCollapsed(!collapsed)}
                size="large"
                style={{
                  backgroundColor: colors[2],
                }}
              />
              <Link className="ml-2" href={PAGE.HOME}>
                <div  style={{fontSize: '1.5rem', fontWeight: 'bold', background: 'white', padding: '0 9px', borderRadius: '4px'}}>
                  <span style={{color: colors[2]}} className="mr-1">R</span>
                  <span style={{color: colors[2]}}>T</span>
                </div>
              </Link>
            </div>
            <div
              className="col-6 d-none d-md-block"
              
            >
              <MainSearch />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
              }}
              className="col p-0"
            >
              <div>
                {auth.accessToken ? (
                  <Space>
                    <div>
                      <Button
                        onClick={(e) => {
                          setIsCartDropDown(!isCartDropDown);
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="p-1"
                        type="text"
                      >
                        <Dropdown
                          open={isCartDropDown}
                          placement="bottom"
                          trigger={["click"]}
                          dropdownRender={() => (
                            <CartComponent
                              onOpen={() => setIsCartDropDown(true)}
                              onFinish={() => {}}
                              onClose={(e) => {
                                e.preventDefault();
                                setIsCartDropDown(false);
                              }}
                              pageData={cart}
                            />
                          )}
                        >
                          <Badge color="#f04770" count={cart.totalElements}>
                            <MdOutlineShoppingCart size={30} color="white" />
                          </Badge>
                        </Dropdown>
                      </Button>
                    </div>

                    <div className="ml-2">
                      <Button
                        type="text"
                        icon={<IoNotificationsSharp size={30} color="white" />}
                      ></Button>
                    </div>
                    <div className="ml-2">
                      <a onClick={() => setIsVisibleDrawerRight(true)}>
                        <Avatar
                          shape="square"
                          src={userProfile.avatar}
                          style={{
                            backgroundColor: userProfile.avatar
                              ? ""
                              : "#2B8ECC",
                          }}
                          size={50}
                          icon={<UserOutlined />}
                        />
                      </a>
                    </div>
                  </Space>
                ) : (
                  <>
                    <Button
                      type="primary"
                      onClick={() => router.push(PAGE.LOGIN)}
                    >
                      Login
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="row d-block d-md-none">
            <div className="col text-center">
            <MainSearch />
              {/* <Search
                style={{ width: "90%", padding: "10px 0" }}
                size="middle"
                placeholder="Search products"
                enterButton="Search"
              /> */}
            </div>
          </div>
        </div>

        <div
          className="row d-none d-md-block"
          style={{ backgroundColor: colors[1] }}
        >
          <div
            // className=" col d-none d-md-block"
            className="col"
          >
            <Menu
              theme="dark"
              style={{ border: "none", backgroundColor: "#205E82" }}
              items={items}
              mode="horizontal"
              onClick={onClick}
              selectedKeys={[current]}
              className=""
            ></Menu>
          </div>
        </div>
        <Drawer
          style={{ backgroundColor: "rgb(255, 255, 255, 0.9" }}
          open={isVisibleDrawer}
          placement="left"
          closable={false}
          title={
            <div className="row">
              <div className="col">Menu</div>
              <div className="col text-right">
                <Button
                  onClick={() => setIsVisibleDrawer(false)}
                  icon={<IoClose size={20} />}
                ></Button>
              </div>
            </div>
          }
        ></Drawer>
        <Drawer
          title={
            <div style={{ justifyContent: "space-between", display: "flex" }}>
              <div>
                <Avatar
                  size={35}
                  src={userProfile.avatar}
                  style={{
                    backgroundColor: userProfile.avatar ? "" : "#2B8ECC",
                  }}
                  icon={<UserOutlined />}
                />
                {userProfile && userProfile.name}
              </div>
              <Button
                type="text"
                onClick={() => setIsVisibleDrawerRight(false)}
                icon={<IoClose style={{ color: "silver" }} size={25} />}
              />
            </div>
          }
          closable={false}
          open={isVisibleDrawerRight}
        >
          <DrawerDownRight onClose={() => setIsVisibleDrawerRight(false)} />
        </Drawer>
        <Drawer
          open={collapsed}
          onClose={() => setCollapsed(false)}
          placement="left"
        >
          <DrawerDownLeft onClose={() => setCollapsed(false)} />
        </Drawer>
      </div>
    </Affix>
  );
};

export default HeaderComponent;
