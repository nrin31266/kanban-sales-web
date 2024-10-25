import { createSlice } from "@reduxjs/toolkit";
import { localDataNames } from "../../constants/appInfos";
import { AuthModel } from "../../models/AuthenticationModel";

// Trạng thái khởi tạo
const initialState: AuthModel = {
    accessToken: '',
    userInfo: {
        id: '',
        name: '',
        email: '',
        roles: []
    }
};

// Tạo slice cho auth
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        data: initialState
    },
    reducers: {
        // Cập nhật toàn bộ thông tin auth
        addAuth: (state, action) => {
            state.data = action.payload;
            syncLocal(action.payload);
        },
        // Xóa thông tin auth và đưa về trạng thái ban đầu
        removeAuth: (state) => {
            state.data = initialState;
            syncLocal({});
        },
        // Chỉ cập nhật accessToken
        refreshAccessToken: (state, action) => {
            state.data.accessToken = action.payload;
            syncLocal({ ...state.data, accessToken: action.payload });
        },
        // Cập nhật thông tin user (userInfo)
        refreshInfo: (state, action) => {
            const { id, name, email, roles } = action.payload;
            state.data.userInfo = {
                id: id ?? state.data.userInfo.id,
                name: name ?? state.data.userInfo.name,
                email: email ?? state.data.userInfo.email,
                roles: roles ?? state.data.userInfo.roles,
            };
            syncLocal(state.data);
        }
    }
});

// Tạo reducer
export const authReducer = authSlice.reducer;

// Export các actions
export const { addAuth, removeAuth, refreshAccessToken, refreshInfo } = authSlice.actions;

// Selector để lấy thông tin auth từ Redux store
export const authSelector = (state: any) => state.authReducer.data;

// Hàm đồng bộ hóa localStorage với Redux store
const syncLocal = (data: AuthModel | {}) => {
    if (data) {
        localStorage.setItem(localDataNames.authData, JSON.stringify(data));
    }
};
