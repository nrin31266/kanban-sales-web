import { UserProfile } from "@/model/UserModel";
import { syncLocalStorage } from "@/utils/localStorage";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UserProfile = {
  avatar: "",
  createdAt: "",
  dob: "",
  gender: 0,
  id: "",
  name: "",
  phone: "",
  updatedAt: "",
  userId: "",
};

const userProfileSlice = createSlice({
  name: "user-profile",
  initialState: { data: initialState },
  reducers: {
    addUserProfile: (state, action) => {
        state.data = action.payload
        syncLocal(state.data);
    },
    removeUserProfile: (state, _action) => {
        state.data = initialState;
        syncLocal(undefined);
    },
  },
});


const syncLocal = (data: UserProfile | undefined) => {
    syncLocalStorage('userProfile', data);
};

export const userProfileReducer = userProfileSlice.reducer;
export const { addUserProfile, removeUserProfile } = userProfileSlice.actions;


export const userProfileSelector = (state: any) => state.userProfileReducer.data;
