import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../rootReducer";
interface IKeyValue{
    id?: string;
    key: string;
    value: any;
}
interface UICommand{
    data: IKeyValue;
    role: string;
}
interface MessageCfg{
    show: boolean;
    type: string;
    message: string;
}
interface UIState {
    uicommand: UICommand;
    showmessage: MessageCfg;
    showlogin_modal: boolean;
    [prop:string]: any;
}
const useInitState = {    
    
    showlogin_modal: false,
    showmessage: {
        show: false,
        type: 'info',
        message: '',
    },
    uicommand: {
        data: {key: 'route', value: "/"},
        role: 'route'
    }
} as UIState;
export interface UIReducerActionPayloadParam{
    key: string;
    value: any;
}
export const uiSlice = createSlice({
    name: 'uictrl',
    initialState: useInitState,
    reducers: {
        setUIStateKey: (state, action: PayloadAction<UIReducerActionPayloadParam>)=>{
            let newState = {...state};
            newState[action.payload.key] = action.payload.value;
            return newState;

        }
    }
});
export const {setUIStateKey} = uiSlice.actions;
export const selectUI = (state: RootState) => state.ui;
export const uiReducer =  uiSlice.reducer;