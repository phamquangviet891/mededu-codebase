import {DeviceUUID} from "device-uuid";
import { createContext } from "react";
import socketIOClient, { Socket } from 'socket.io-client';
import { myapp } from "../../appconfigs/default";
import { fire_message_event } from "../socket.events";
import { MyAppRegisterAllSocketEvents } from "../socketFn";



export const socket = socketIOClient(
    `${myapp.backend.SOCKET_BACKEND}/${myapp.identify.APP_ID}`,{
        autoConnect: true, 
    } //option of socket manager
);

socket.on('connect', ()=>{
    console.log('socket client connect');
    MyAppRegisterAllSocketEvents(socket);
    let duuid: string = new DeviceUUID().get();
    let sockMsg = {
        UUID: duuid,
        AppScope: myapp.identify.APP_ID,
        extInfo:"socket.init",
    }; 
    fire_message_event(socket,"HUMAN_DEVICE_ONLINE",[],sockMsg);
});
socket.on("connect_error", (err: any) => {
    console.log(`connect_error due to ${err.message}`);
});

export const SocketContext = createContext<Socket|null>(null);