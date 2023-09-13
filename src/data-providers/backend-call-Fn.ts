import axios, { Axios, AxiosInstance, AxiosResponse } from 'axios';
import { TaskDefine } from '../appconfigs/data.types/app.types';
import { myapp } from '../appconfigs/default';
export interface MyAppCred{
    username: string;
    password: string;    
}
export function ApiLogin(cred: MyAppCred): Promise<AxiosResponse>{
    let apiClient = CreateJSONRequestClient();
    let sendData = {
        email: cred.username, 
        password: cred.password
    }
    console.log(sendData);
    return apiClient.post("/api/users/login",sendData);
}
export function CreateJSONRequestClient(token: string|null = null): AxiosInstance{
    return axios.create({
        baseURL: myapp.backend.BASE_API_URL,
        headers: {
            "content-type": "application/json",
            "accept": "application/json",
            "apikey": myapp.identify.APP_KEY,
            "authorization": `Bearer ${token}`
        }
    })
}
export function ApiLoadNotify(token: string): Array<any>{
    //let apiClient = CreateJSONRequestClient(token);
    //return apiClient.get()
    return [
        
    ];
}
export function ApiLoadTask(token: string): Array<TaskDefine>{
    //let apiClient = CreateJSONRequestClient(token);
    //return apiClient.get()
    const createFakeTask = (amount: number): Array<TaskDefine>=>{
        let tasks:Array<TaskDefine> = [];
        for(let i = 1; i < amount; i++){
            tasks.push(
                {
                    id: `${i}`,
                    name: "Task Name "+ `000000${i}`.substring(`000000${i}`.length - 3),
                    description: "Thuc hien cong viec:"+`000000${i}`.substring(`000000${i}`.length - 3),
                    deadLine: new Date(),
                    beginDate: new Date(),
                    relationsUser: [],
                    percentComplete: 50
                }
            );
        }
        return tasks
    }
    return createFakeTask(100);
}
export function ApiUploadFile (token: string,file: any): Promise<any>{
    var formData = new FormData();
    formData.set("files",file.blob(), file.name);
    let apiClient = axios.create({
        baseURL: myapp.backend.BASE_API_URL,
        headers: {
            //"content-type": "multipart/form-data",
            "accept": "application/json",
            "apikey": myapp.identify.APP_KEY,
            "authorization": `Bearer ${token}`
        }
    });
    return apiClient.post('/api/files', formData, {headers: {
        'Content-Type': 'multipart/form-data'
      }});
}
