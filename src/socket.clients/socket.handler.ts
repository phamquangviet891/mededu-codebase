import { receivedNotifyMessage } from "../redux/slices/notifySlice";
import store from "../redux/store";
import {v4 as uuidv4} from 'uuid';

export const socket_events = [
    {
        name: "BROADCAST",
        handler: (msg:any)=>{
            console.log(msg);
            store.dispatch(receivedNotifyMessage(msg));
        },  
    },
    {
        name: "STATUS",
        handler: (msg:any)=>{
            console.log(msg);
            store.dispatch(receivedNotifyMessage({
                id: uuidv4(),
                title: msg.message,
                notifyTime: new Date(),
                content: msg.message,
                from: 'system host',
                read: false,
                subject: msg.message
            }))
        },  
    },
]