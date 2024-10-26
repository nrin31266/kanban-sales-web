import { createSlice } from "@reduxjs/toolkit";
import { AuthModel } from '@/model/AuthenticationModel';
import { localDataNames } from "@/constants/appInfos";

const initialState: AuthModel = {
    accessToken: '',
    userInfo: {
        id: '',
        name: '',
        email: '',
        roles: []
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {data: initialState},
    reducers: {
        addAuth: (state, action)=>{
            state.data = action.payload;
            syncLocal(state.data);
        },
        removeAuth: (state, _action) =>{
            state.data = initialState;
            syncLocal({});
        }
    },
})

const syncLocal = (data: AuthModel | {}) => {
    if (data) {
        localStorage.setItem(localDataNames.authData, JSON.stringify(data));
    }
};

export const authReducer = authSlice.reducer;
export const {addAuth, removeAuth} = authSlice.actions;

export const authSelector = (state: any) => state.authReducer.data;
