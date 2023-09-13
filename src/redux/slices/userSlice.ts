import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../rootReducer";

interface UserState {
    accessInfo?: {
        id?: string;
        token: string;
        scope:any;
    }|null;
    userProfile?: any;
    [prop:string]: any;
}
export const userInitState = {accessInfo: null, profile: null} as UserState;
export const userSlice = createSlice({
    name: 'user',
    initialState: userInitState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>)=>{
            state = action.payload;
            return state;
        }
    }
});
export const {setUser} = userSlice.actions;
export const selectUser = (state: RootState) => state;
export const userReducer =  userSlice.reducer;