import { Socket } from "socket.io-client";
import { socket_events } from "./socket.handler";

export function MyAppRegisterAllSocketEvents(sock:Socket){
    for (const event of socket_events) {
      console.log(`Dang ky su kien: ${event.name}`);
      sock?.on(event.name, event.handler);
    }
};