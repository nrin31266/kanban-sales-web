import React, { ReactNode } from "react";
import Link from "next/link";
import MenuItem from "./componets/Menu";

interface LayoutProps {
  children: ReactNode; // Nội dung của các trang con sẽ được render tại đây
}

const AccountLayout = ({ children }: LayoutProps) => {
  return (
    <div className="container d-flex">
      <div style={{ width: "200px", background: "#f5f5f5", padding: "20px" }}>
        {/* Menu sidebar */}
        <MenuItem />
      </div>

      {/* Nội dung thay đổi khi chuyển giữa các trang */}
      <div style={{ marginLeft: "20px", flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default AccountLayout;
