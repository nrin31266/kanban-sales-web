import { colors } from "@/constants/appInfos";
import React from "react";

const Logo = () => {
  return (
    <div
      style={{
        fontSize: "1.5rem",
        fontWeight: "bold",
        background: "white",
        padding: "0 9px",
        borderRadius: "4px",
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
