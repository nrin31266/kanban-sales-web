import React, { ReactNode } from "react";
import Link from "next/link";
import MenuItem from "./componets/Menu";

interface LayoutProps {
  children: ReactNode; 
}

const AccountLayout = ({ children }: LayoutProps) => {
  return (
    <div className="container p-0 d-flex">
      <MenuItem />
      <div style={{width: '100%'}}>
        {children}
      </div>
    </div>
  );
};

export default AccountLayout;
