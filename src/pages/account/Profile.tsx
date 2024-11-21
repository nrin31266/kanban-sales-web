import handleAPI from "@/apis/handleAPI";
import { API } from "@/configurations/configurations";
import { AuthModel } from "@/model/AuthenticationModel";
import { UserProfileRequest } from "@/model/UserModel";
import { authSelector } from "@/reducx/reducers/authReducer";
import { userProfileSelector } from "@/reducx/reducers/profileReducer";
import { uploadFile } from "@/utils/uploadFile";
import { Avatar, Button, Card } from "antd";
import { UserProfile } from "firebase/auth";
import React, { useRef } from "react";
import { useSelector } from "react-redux";

const Profiles = () => {
  const auth: AuthModel = useSelector(authSelector);
  const avtRef = useRef<any>(null);
  const userProfile: UserProfile = useSelector(userProfileSelector);

  const handleFileChange =async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const photoUrl = await uploadFile(file);
      if(photoUrl){
        const res = await handleAPI(`${API.USER_PROFILE}/avatar`, {avatar: photoUrl}, 'put');
        console.log(res.data);
      }
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
