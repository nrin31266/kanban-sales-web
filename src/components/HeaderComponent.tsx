import { PAGE } from "@/configurations/configurations";
import { AuthModel } from "@/model/AuthenticationModel";

import { PageResponse } from "@/model/AppModel";
import { CartResponse } from "@/model/CartModel";
import { authSelector, removeAuth } from "@/reducx/reducers/authReducer";
import { cartSelector } from "@/reducx/reducers/cartReducer";
import { UserOutlined } from "@ant-design/icons";
import {
  Affix,
  Avatar,
  Badge,
  Button,
  Drawer,
  Dropdown,
  Menu,
  Space,
} from "antd";
import { useRouter } from "next/router";
import { MenuProps } from "rc-menu";
import { useEffect, useState } from "react";
import { FcLike } from "react-icons/fc";
import { FiSearch } from "react-icons/fi";
import { IoClose, IoNotificationsSharp } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { RiMenuUnfold3Line2 } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import CartComponent from "./CartComponent";
import DrawerDownRight from "./DrawerDownRight";
import { userProfileSelector } from "@/reducx/reducers/profileReducer";
import { UserProfile } from "@/model/UserModel";

type MenuItem = Required<MenuProps>["items"][number];

const HeaderComponent = () => {
  const auth: AuthModel = useSelector(authSelector);
  const pages = new Map<string, string>([
    ["home", PAGE.HOME],
    ["shop", PAGE.SHOP],
  ]);
  const router = useRouter();
  const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);
  const cart: PageResponse<CartResponse> = useSelector(cartSelector);
  const dispatch = useDispatch();
  const [current, setCurrent] = useState("home");
  const [isCartDropDown, setIsCartDropDown] = useState(false);
  const [isVisibleDrawerRight, setIsVisibleDrawerRight] = useState(false);
  const userProfile: UserProfile = useSelector(userProfileSelector);

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
      key: "1",
      children: [
        {
          label: "All",
          key: "shop",
        },
      ],
    },
  ];

  const handleLogout = async () => {
    dispatch(removeAuth({}));
  };

  return (
    <Affix offsetTop={0}>
      <div style={{ backgroundColor: "#e0e0e0" }}>
        <div className="row header">
          <div className="d-block d-md-none col">
            <Button
              className=""
              onClick={() => setIsVisibleDrawer(true)}
              type="default"
              icon={<RiMenuUnfold3Line2 size={20} />}
            ></Button>
          </div>
          <div className="col d-none d-md-block">LOGO</div>
          <div className="col d-none d-md-block">
            <Menu
              style={{ border: "none" }}
              items={items}
              mode="horizontal"
              onClick={onClick}
              selectedKeys={[current]}
              className=""
            ></Menu>
          </div>
          <div
            style={{ alignItems: "center", justifyContent: "right" }}
            className="col d-flex"
          >
            <Space>
              {auth.userInfo &&
                (auth.userInfo.emailVerified === false ||
                  auth.userInfo.emailVerified === null) && (
                  <Button size="small" className="p-1" type="primary">
                    Verify
                  </Button>
                )}
              {auth.accessToken ? (
                <>
                  <Button type="text" icon={<FiSearch size={20} />}></Button>
                  <Button type="text" icon={<FcLike size={20} />}></Button>
                  <div style={isCartDropDown ? {} : {}}>
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
                        <Badge count={cart.totalElements}>
                          <MdOutlineShoppingCart size={20} />
                        </Badge>
                      </Dropdown>
                    </Button>
                  </div>

                  <Button
                    type="text"
                    icon={<IoNotificationsSharp size={20} />}
                  ></Button>
                  <a onClick={() => setIsVisibleDrawerRight(true)}>
                    <Avatar
                      size={35}
                      style={{ backgroundColor: "#2B8ECC" }}
                      icon={<UserOutlined />}
                    />
                  </a>
                </>
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
            </Space>
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
                  style={{ backgroundColor: "#2B8ECC" }}
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
      </div>
    </Affix>
  );
};

export default HeaderComponent;
