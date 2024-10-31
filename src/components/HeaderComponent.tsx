import { PAGE } from "@/configurations/configurations";
import { AuthModel } from "@/model/AuthenticationModel";

import {
  authReducer,
  authSelector,
  removeAuth,
} from "@/reducx/reducers/authReducer";
import { changePage, pageSelector } from "@/reducx/reducers/pageReducer";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Menu, Space } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { MenuProps } from "rc-menu";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type MenuItem = Required<MenuProps>["items"][number];

const HeaderComponent = () => {
  const auth: AuthModel = useSelector(authSelector);
  const pages = new Map<string, string>([
    ["home", PAGE.HOME],
    ["shop", PAGE.SHOP],
  ]);
  const router = useRouter();

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
    <div className="p-3">
      <div className="row">
        <div className="col">LOGO</div>
        <div className="col">
          <Menu
            style={{ border: "none" }}
            items={items}
            mode="horizontal"
            onClick={onClick}
            selectedKeys={[current]}
          ></Menu>
        </div>
        <div className="col text-right">
          <Space>
            {auth.userInfo &&
              (auth.userInfo.emailVerified === false ||
                auth.userInfo.emailVerified === null) && (
                <Button type="primary">Verify account</Button>
              )}
            {auth.accessToken ? (
              <>
                {/* <Avatar /> */}
                <Button
                  type="text"
                  icon={<FontAwesomeIcon icon={faRightFromBracket} />}
                  onClick={handleLogout}
                />
              </>
            ) : (
              <>
                <Button type="primary" onClick={() => router.push(PAGE.LOGIN)}>
                  Login
                </Button>
              </>
            )}
          </Space>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
