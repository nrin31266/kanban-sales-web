import { Avatar, Card, Menu } from "antd";
import { useRouter } from "next/router";
import { useState, useCallback, useEffect } from "react";
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

const MenuItem = () => {
  const userProfile: UserProfile = useSelector(userProfileSelector);
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>("");
  useEffect(() => {
    const { pathname } = router;

    // Dự đoán key dựa trên pathname
    if (pathname === "/account/profile") {
      setSelectedKey("profile");
    } else if (pathname === "/account/orders") {
      setSelectedKey("orders");
    } else {
      // Xử lý trường hợp khác nếu cần
      setSelectedKey("");
    }
  }, [router.pathname]);

  const menuItems = [
    {
      key: "profile",
      label: "Your Profile",
      icon: <CgProfile size={25} />,
      onClick: () => router.push("/account/profile"),
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: <FaBell size={25} />,
    },
    {
      key: "orders",
      label: "My Orders",
      icon: <FaBox size={25} />,
      onClick: () => router.push("/account/orders"),
    },
    {
      key: "wishlists",
      label: "My Wishlists",
      icon: <FaHeart size={25} />,
    },
    {
      key: "addresses",
      label: "Manage Addresses",
      icon: <FaMapMarkerAlt size={25} />,
    },
    {
      key: "cards",
      label: "Saved Cards",
      icon: <FaRegCreditCard size={25} />,
    },
  ];

  const renderMenuItems = useCallback(() => {
    return menuItems.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      onClick: item.onClick,
    }));
  }, [menuItems]);

  return (
    <div className="account-menu">
      <Card className="">
        <div className="d-flex">
          <div>
            <Avatar
              src={userProfile.avatar && userProfile.avatar}
              size={50}
              style={{ backgroundColor: userProfile.avatar ? "" : "#2B8ECC" }}
              icon={<UserOutlined />}
            />
          </div>
          <div>
            {"Hello "}
            {userProfile.name}
          </div>
        </div>
      </Card>
      <Menu
        mode="inline"
        style={{ width: 256 }}
        items={renderMenuItems()}
        selectedKeys={[selectedKey]}
      />
    </div>
  );
};

export default MenuItem;
