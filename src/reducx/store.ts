import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./reducers/authReducer";
import { pageReducer } from "./reducers/pageReducer";

const store = configureStore({
    reducer: {
        authReducer,
        pageReducer
    }
});

export default store;