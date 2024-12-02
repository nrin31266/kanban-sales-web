import { colors } from "@/constants/appInfos";
import React from "react";

const Logo = ({size}:{size?: number}) => {
  return (
    <div
    className="logo"
      style={{
        fontSize: `${size?? '1.5'}rem`,
        fontWeight: "bold",
        background: "white",
        padding: "0 0.9rem",
        borderRadius: "4px",
        width: 'max-content'
      }}
    >
      <span style={{ color: colors[2] }} className="">
        R
      </span>
      <span style={{ color: colors[2] }}>T</span>
    </div>
  );
};

export default Logo;
