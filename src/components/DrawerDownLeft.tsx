import React from "react";
import { authSelector, removeAuth } from "@/reducx/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider } from "antd";
import { CgProfile } from "react-icons/cg";
import {
  FaBell,
  FaBox,
  FaHeart,
  FaMapMarkerAlt,
  FaRegCreditCard,
} from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/router";
import { PAGE } from "@/configurations/configurations";
import { removeUserProfile } from "@/reducx/reducers/profileReducer";
import { BiHome } from "react-icons/bi";
import { SiHoppscotch } from "react-icons/si";

interface Props {
  onClose: () => void;
}

const DrawerDownLeft = (props: Props) => {
  const { onClose } = props;
  const router = useRouter();
  const dispatch = useDispatch();

  

  return (
    <div className="drawer-right">
      <Button
        onClick={() => {
          router.push(PAGE.HOME);
          onClose();
        }}
        size="large"
        type="text"
      >
        Home
      </Button>
      <Button
        onClick={() => {
          router.push(PAGE.SHOP);
          onClose();
        }}
        size="large"
        type="text"
      >
        Shop
      </Button>
    </div>
  );
};

export default DrawerDownLeft;
