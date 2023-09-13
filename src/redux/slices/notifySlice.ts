import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotifyDefine } from "../../appconfigs/data.types/app.types";
import { ApiLoadNotify } from "../../data-providers/backend-call-Fn";


const notifyInitState: Array<any> = [] ;
export const notifySlice = createSlice({
    name: 'notifyctrl',
    initialState: notifyInitState,
    reducers: {
        setNotifyItems: (state, action: PayloadAction<Array<NotifyDefine|any|never>>)=>{
            let newitems = action.payload;
            state = newitems
            return state;
        },
        loadNotify: (state, action: PayloadAction<string>)=>{
            let token = action.payload;
            state = ApiLoadNotify(token);
            return state;
        },
        receivedNotifyMessage: (state, action: PayloadAction<NotifyDefine>)=>{
            let newitems = [...state];
            let indexFound = newitems.findIndex(el=>el.id === action.payload.id);
            if(indexFound === -1){
                newitems.push({...action.payload, read: false});
            }else{
                newitems.splice(indexFound,1);
                newitems.splice(indexFound,0,{...action.payload, read: false});
            }
            newitems.reverse()
            return newitems;
        },
        updatedNotiMessage: (state, action: PayloadAction<any>)=>{
            let newitems = [...state];
            let indexFound = newitems.findIndex(el=>el.id === action.payload.id);
            
            if(indexFound === -1){
                newitems.push({...action.payload, read: false});
            }else{
                let updItem = {...newitems[indexFound]};
                for (const key in action.payload) {
                    if (Object.prototype.hasOwnProperty.call(action.payload, key)) {
                        if(key !=='id'){
                            updItem[key] = action.payload[key];
                        }
                    }
                }
                newitems.splice(indexFound,1);
                newitems.splice(indexFound,0,updItem);
            }
            newitems.reverse()
            return newitems;
        }
    }
});
export const {setNotifyItems,loadNotify,receivedNotifyMessage,updatedNotiMessage} = notifySlice.actions;
export const notifyReducer =  notifySlice.reducer;