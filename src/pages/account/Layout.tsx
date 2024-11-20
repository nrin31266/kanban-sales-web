import React, { ReactNode } from "react";
import Link from "next/link";
import MenuItem from "./componets/Menu";

interface LayoutProps {
  children: ReactNode; 
}

const AccountLayout = ({ children }: LayoutProps) => {
  return (
    <div className="container d-flex">
      <div className="mr-2">
        <MenuItem />
      </div>
      <div style={{width: '100%'}}>
        {children}
      </div>
    </div>
  );
};

export default AccountLayout;
