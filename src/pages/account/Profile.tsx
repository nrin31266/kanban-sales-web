import { AuthModel } from "@/model/AuthenticationModel";
import { authSelector } from "@/reducx/reducers/authReducer";
import { Avatar, Button, Card } from "antd";
import React, { useRef } from "react";
import { useSelector } from "react-redux";

const Profiles = () => {
  const auth: AuthModel = useSelector(authSelector);
  const avtRef = useRef<any>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file: ", file.name);
    }
  };

  return (
    <div>
      <Card>
        <div>
          <Avatar size={100} src={""}></Avatar>
          <Button type="link" onClick={()=>{avtRef.current?.click()}}>Select photo</Button>
        </div>
      </Card>

      <input
        ref={avtRef}
        className="d-none"
        type="file"
        id="file-upload"
        accept="image/jpeg, image/png, image/gif, image/webp" // Giới hạn chọn ảnh
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Profiles;
