import { createSlice } from "@reduxjs/toolkit";
import { AuthModel } from '@/model/AuthenticationModel';
import { localDataNames } from "@/constants/appInfos";
import { syncLocalStorage } from "@/utils/localStorage";

const initialState: AuthModel = {
    accessToken: '',
    userInfo: {
        id: '',
        email: '',
        roles: []
    },
    type: ''
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
            syncLocal(undefined);
        }
    },
})

const syncLocal = (data: AuthModel | undefined) => {
    syncLocalStorage(localDataNames.authData, data);
};

export const authReducer = authSlice.reducer;
export const {addAuth, removeAuth} = authSlice.actions;

export const authSelector = (state: any) => state.authReducer.data;
