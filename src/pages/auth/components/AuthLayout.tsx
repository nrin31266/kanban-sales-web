import LeftHalfPanel from "@/components/LeftHalfPanel";
import Logo from "@/components/Logo";
import { Card } from "antd";
import React, { ReactNode } from "react";

interface Props{
    children: ReactNode
}

const AuthLayout = (props: Props) => {
    const {children}= props
  return (
    // <div className="row">
    //   <div className="d-none d-md-block col-6 p-0">
    //     <LeftHalfPanel />
    //   </div>
    //   <div className="col-md-6 col-sm-12">
    //     <div
    //       className="container d-flex"
    //       style={{
    //         height: "100vh",
    //         backgroundColor: "white",
    //         alignItems: "center",
    //       }}
    //     >
          
    //     </div>
    //   </div>
    // </div>
    <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Card
            className="col-sm-12 col-md-8 col-lg-6"
            style={{ backgroundColor: "", height: '80%' }}
          >
            <div className="d-flex" style={{ justifyContent: "center" }}>
                  <Logo size={3} />
                </div>
            {children}
          </Card>
    </div>
  );
};

export default AuthLayout;
