// components/Layout.tsx
import { Affix, Avatar, Card, Divider, Layout, Menu } from "antd";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import {
  FaBell,
  FaBox,
  FaHeart,
  FaMapMarkerAlt,
  FaRegCreditCard,
} from "react-icons/fa";
import { UserOutlined } from "@ant-design/icons";
import { UserProfile } from "@/model/UserModel";
import { useSelector } from "react-redux";
import { userProfileSelector } from "@/reducx/reducers/profileReducer";
import Link from "next/link";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const userProfile: UserProfile = useSelector(userProfileSelector);
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>("");
  // const [collapsed, setCollapsed] = useState(false);

  // Cập nhật selectedKey khi pathname thay đổi
  useEffect(() => {
    const { pathname } = router;
    if (pathname === "/account") {
      setSelectedKey("profile");
    } else if (pathname.startsWith("/orders")) {
      setSelectedKey("orders");
    } else if (pathname === "/account/notifications") {
      setSelectedKey("notifications");
    } else {
      setSelectedKey("");
    }
  }, [router.pathname]);

  //   useEffect(() => {
  //   const handleResize = () => {
  //     const width = window.innerWidth;
  //     const collapsed = width < 768 ? true : false;
  //     setCollapsed(collapsed);

  //   };
  //   window.addEventListener("resize", handleResize);
  //   handleResize();
  //   return () => window.removeEventListener("resize", () => {});
  // }, []);

  const menuItems = [
    {
      key: "profile",
      label: "Your Profile",
      icon: <CgProfile size={25} />,
      link: "/account",
    },
    {
      key: "orders",
      label: "My Orders",
      icon: <FaBox size={25} />,
      link: "/orders",
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: <FaBell size={25} />,
      link: "/account/notifications",
    },
    {
      key: "wishlists",
      label: "My Wishlists",
      icon: <FaHeart size={25} />,
      link: "/account/wishlists",
    },
    {
      key: "addresses",
      label: "Manage Addresses",
      icon: <FaMapMarkerAlt size={25} />,
      link: "/account/addresses",
    },
    {
      key: "cards",
      label: "Saved Cards",
      icon: <FaRegCreditCard size={25} />,
      link: "/account/cards",
    },
  ];

  return (
    <div className="container">
      <Layout>
        {/* Menu bên trái */}
        {/* <Sider trigger={null} collapsible collapsed={collapsed}>
          
        </Sider> */}
         <Sider width={"250px"} className="d-none d-md-block" theme="light">
          <div>
            <div className="d-flex mt-3" style={{alignItems:'center', justifyContent: 'center'}}>
              <Avatar
                src={userProfile.avatar && userProfile.avatar}
                size={50}
                style={{
                  backgroundColor: userProfile.avatar ? "" : "#2B8ECC",
                }}
                icon={<UserOutlined />}
              />
              <div>{`Hello ${userProfile.name}`}</div>
            </div>
            <Divider/>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
            >
              {menuItems.map((item) => (
                <Menu.Item key={item.key} icon={item.icon}>
                  <Link href={item.link}>{item.label}</Link>
                </Menu.Item>
              ))}
            </Menu>
          </div>
        </Sider>

        <Content>{children}</Content>
      </Layout>
    </div>
  );
};

export default AccountLayout;
