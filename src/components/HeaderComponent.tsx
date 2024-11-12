import { PAGE } from "@/configurations/configurations";
import { AuthModel } from "@/model/AuthenticationModel";

import {
  authReducer,
  authSelector,
  removeAuth,
} from "@/reducx/reducers/authReducer";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Affix, Badge, Button, Drawer, Menu, Space } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { MenuProps } from "rc-menu";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { FiSearch } from "react-icons/fi";
import { IoNotificationsSharp } from "react-icons/io5";
import { RiMenuUnfold3Line2 } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import useSelection from "antd/es/table/hooks/useSelection";
import { cartSelector } from "@/reducx/reducers/cartReducer";
import { SubProductResponse } from "@/model/SubProduct";

type MenuItem = Required<MenuProps>["items"][number];

const HeaderComponent = () => {
  const auth: AuthModel = useSelector(authSelector);
  const pages = new Map<string, string>([
    ["home", PAGE.HOME],
    ["shop", PAGE.SHOP],
  ]);
  const router = useRouter();
  const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);
  const cart : SubProductResponse[] = useSelector(cartSelector);
  const dispatch = useDispatch();
  const [current, setCurrent] = useState("home");

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
        <div className="row" style={{}}>
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
          <div className="col text-right ">
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
                  <Button
                    type="text"
                    icon={
                      <Badge count={cart.length}>
                        <MdOutlineShoppingCart size={20} />
                      </Badge>
                    }
                  ></Button>
                  <Button
                    type="text"
                    icon={<IoNotificationsSharp size={20} />}
                  ></Button>
                  <Button
                    type="text"
                    icon={<FontAwesomeIcon icon={faRightFromBracket} />}
                    onClick={handleLogout}
                  />
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
      </div>
    </Affix>
  );
};

export default HeaderComponent;
