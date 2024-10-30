import { PAGE } from "@/configurations/configurations";
import { AuthModel } from "@/model/AuthenticationModel";

import {
  authReducer,
  authSelector,
  removeAuth,
} from "@/reducx/reducers/authReducer";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Button, Layout, Space } from "antd";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const HeaderComponent = () => {
  const auth: AuthModel = useSelector(authSelector);
  console.log(auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(removeAuth({}));
  };

  return (
    <div className="p-3">
      <div className="row">
        <div className="col">papa</div>
        <div className="col" style={{ textAlign: "right" }}>
          <Space>
            {
              auth.userInfo && (auth.userInfo.emailVerified===false || auth.userInfo.emailVerified===null ) &&
              <Button type="primary" onClick={handleLogout}>Verify account</Button>
              
            }
            {auth.accessToken ? (
              <>
                {/* <Avatar /> */}
                <Button type="text" icon={<FontAwesomeIcon icon={faRightFromBracket} />} onClick={handleLogout} />
              </>
            ) : (
              <>
                <Link href={PAGE.LOGIN}>Login</Link>
              </>
            )}
          </Space>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
