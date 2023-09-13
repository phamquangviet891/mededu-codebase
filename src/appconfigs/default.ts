export namespace myapp{
    export namespace identify{
        export const APP_ID: string = "ManagerApp-10071981";
        export const APP_NAME: string = "Ứng dụng của tôi";
        export const APP_KEY: string = "DF2A09EC-199C-4599-A74F-84D0454BA2B0";
        export const STORAGE_USER_KEY = "STORAGE_USER_KEY";
    }
    export namespace frontend{
        export const PUBLIC_URL = "http/localhost:8001";
    }
    export namespace backend{
        export const BASE_API_URL: string = 
        //"https://apicentral.infinitysolution.vn";
        "http://localhost:3002";
        export const SOCKET_BACKEND: string = "wss://apicentral.infinitysolution.vn";
    }
    export namespace rules{
        export const password = {
            minLength: 3,
            maxLength: 30,
        }
        export const store_authenticate:{expired_in: number; unit: string; key:string} = {
            expired_in: 60,
            unit: "day", //sec,min/hour/day/mon/month
            key: "NEXT_LOGIN"
        }
    }
}