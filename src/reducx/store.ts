import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./reducers/authReducer";
import { cartReducer } from "./reducers/cartReducer";
import { userProfileReducer } from "./reducers/profileReducer";

const store = configureStore({
    reducer: {
        authReducer,
        cartReducer,
        userProfileReducer,
    }
});

export default store;