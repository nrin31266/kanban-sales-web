// components/Layout.tsx
import { Avatar, Card, Layout, Menu } from "antd";
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

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const userProfile: UserProfile = useSelector(userProfileSelector);
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>("");
  // const [collapsed, setCollapsed] = useState(false);

  // Cập nhật selectedKey khi pathname thay đổi
  useEffect(() => {
    const { pathname } = router;
    if (pathname === "/account/profile") {
      setSelectedKey("profile");
    } else if (pathname.startsWith("/account/orders")) {
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
      link: "/account/profile",
    },
    {
      key: "orders",
      label: "My Orders",
      icon: <FaBox size={25} />,
      link: "/account/orders",
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
        <div className="d-none d-md-block" style={{ width: 256 }}>
          <Card>
            <div className="d-flex">
              <Avatar
                src={userProfile.avatar && userProfile.avatar}
                size={50}
                style={{ backgroundColor: userProfile.avatar ? "" : "#2B8ECC" }}
                icon={<UserOutlined />}
              />
              <div>{`Hello ${userProfile.name}`}</div>
            </div>
          </Card>

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ width: 256 }}
          >
            {menuItems.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link href={item.link}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </div>

        {/* Phần nội dung bên phải */}
        <div style={{ flex: 1 }}>{children}</div>
      </Layout>
    </div>
  );
};

export default AccountLayout;
