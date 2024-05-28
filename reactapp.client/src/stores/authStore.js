import {combineReducers, configureStore} from "@reduxjs/toolkit";

import authReducer from "../reducers/auth.reducer";

const rootReducer = combineReducers({
    auth : authReducer,
})

export default configureStore({
    reducer: rootReducer,
})