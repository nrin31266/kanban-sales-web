import handleAPI from "@/apis/handleAPI";
import { API } from "@/configurations/configurations";
import { AuthModel } from "@/model/AuthenticationModel";
import { UserProfile } from "@/model/UserModel";
import { authSelector } from "@/reducx/reducers/authReducer";
import {
  addUserProfile,
  userProfileSelector,
} from "@/reducx/reducers/profileReducer";
import { uploadFile } from "@/utils/uploadFile";
import { Avatar, Button, Card, message } from "antd";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Profiles = () => {
  const auth: AuthModel = useSelector(authSelector);
  const avtRef = useRef<any>(null);
  const userProfile: UserProfile = useSelector(userProfileSelector);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);

      try {
        const photoUrl = await uploadFile(file);
        if (photoUrl) {
          const res = await handleAPI(
            `${API.USER_PROFILE}/avatar`,
            { avatar: photoUrl },
            "put"
          );
          dispatch(addUserProfile(res.data.result));
          message.success("Ok");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <Card>
        <div>
          <Avatar  style={{ backgroundColor: userProfile.avatar  ? "silver":  "#2B8ECC" }} size={100} src={userProfile.avatar}></Avatar>
          <Button
            disabled={isLoading}
            loading={isLoading}
            type="link"
            onClick={() => {
              avtRef.current?.click();
            }}
          >
            Select photo
          </Button>
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
