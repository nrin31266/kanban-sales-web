import { Typography } from "antd";
import React, { ReactNode } from "react";

interface Props {
  titleAlign?: "text-center" | "text-right" | "text-left";
  title: string;
  titleLevel: 1 | 2 | 3 | 4 | 5 | undefined;
  titleRight?: ReactNode;
  children: ReactNode;
}

const TabBarComponent = (props: Props) => {
  const { title, titleAlign, titleLevel, titleRight, children } = props;
  return (
    <div className="" style={{ backgroundColor: "white"}}>
      <div className="row">
        <div className={`${titleRight ? "col-9" : "col"} ${titleAlign}`}>
          <Typography.Title level={titleLevel}>{title} </Typography.Title>
        </div>
        {titleRight && <div className="col-3 text-right">{titleRight}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default TabBarComponent;
