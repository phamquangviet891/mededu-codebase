import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskDefine } from "../../appconfigs/data.types/app.types";
import { ApiLoadTask } from "../../data-providers/backend-call-Fn";


const taskInitState: Array<TaskDefine> = [];
export const taskSlice = createSlice({
    name: 'taskctrl',
    initialState: taskInitState,
    reducers: {
        setTaskItems: (state, action: PayloadAction<Array<TaskDefine|any|never>>)=>{
            let newitems = action.payload;
            state = newitems
            return state;
        },
        loadTask: (state, action: PayloadAction<string>)=>{
            let token = action.payload;
            state = ApiLoadTask(token);
            return state;

            
            
        }
    }
});
export const {setTaskItems,loadTask} = taskSlice.actions;
export const taskReducer =  taskSlice.reducer;