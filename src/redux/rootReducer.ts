import { combineReducers } from "@reduxjs/toolkit";
import { notifyReducer } from "./slices/notifySlice";
import { taskReducer } from "./slices/taskSlice";
import { uiReducer } from "./slices/uiSlice";
import { userReducer } from "./slices/userSlice";

const rootReducer = combineReducers({
    user: userReducer,
    ui: uiReducer,
    notifyItems: notifyReducer,
    taskItems: taskReducer,

});
export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;