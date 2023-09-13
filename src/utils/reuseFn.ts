import { useIonRouter } from "@ionic/react";
import { createBrowserHistory } from "history";
import { render } from "react-dom";
import { Redirect } from "react-router";
import { FuncWithCallbackData } from "../appconfigs/data.types/app.types";
import { myapp } from "../appconfigs/default";
import { GetOrCreateStore } from "../data-providers/localstorage";
import { updatedNotiMessage } from "../redux/slices/notifySlice";
import { setUIStateKey } from "../redux/slices/uiSlice";
import { setUser, userInitState } from "../redux/slices/userSlice";
import store from "../redux/store";

export function MyApp_GetColor(msgType: string):string{
    switch (msgType){
        case 'error':
            return 'danger';
        case 'warning':
            return 'warning';

        default:
            return 'primary'
    }
}
export function calculateExpireEpoche(conf: {expired_in: number; unit: string}):number{
    let numval = 0;
    switch(conf.unit){
        case "s":
        case "sec":
        case "second":
            numval = Number(conf.expired_in);
            break;
        case "m":
        case "min":
        case "minute":
        case "minutes":
            numval = Number(conf.expired_in) * 60;
            break;
        case "h":
        case "hour":
        case "hours":
            numval = Number(conf.expired_in) * 60 *60;
            break;
        case "d":
        case "day":
        case "days":
            numval = Number(conf.expired_in) * 24 * 60 * 60;
            break;
        case "mon":
        case "month":
        case "months":
            numval = Number(conf.expired_in) * 24 * 60 * 60 *30;
            break;
        case "y":
        case "year":
        case "years":
            numval = Number(conf.expired_in) * 24 * 60 * 60 * 365;
            break;
        default:
            numval = Number(conf.expired_in);
    }
    let exp_epoche = Math.floor(Date.now()/1000) + numval
    return exp_epoche;
}
export async function selectItemFn(history: any,cbdata: FuncWithCallbackData){
    console.log(`Item on popover, menuKey: ${cbdata.data.menuKey} action: ${cbdata.data.actionType} role: ${cbdata.role}`);
    //đoạn xử lý cho các tuy chon của người dùng trên popover
    store.dispatch(setUIStateKey({key: "showmessage", value: {type:'info',message:'Thong bao choi',show: true}}))
    if(cbdata.role === 'confirm'){
      switch (cbdata.data.menuKey){
        //phan xu ly login logout
        case 'userLogin':
          console.info('show login modal');
          store.dispatch(setUIStateKey({key:'showlogin_modal', value: true}));
          break;
        case 'userLogout':
          console.info('xu ly luong log out');
          store.dispatch(setUser(userInitState));
          let localStorage = await GetOrCreateStore();
            await localStorage.remove(myapp.identify.STORAGE_USER_KEY);
          break;  
        //end phan xu ly login logout
        //xu ly phan chon task cu the
        case 'taskItemSelect':
            store.dispatch(setUIStateKey({key:"uicommand", value: {data: {key: 'forward', value:`/tasks/${cbdata.data.value}`}, role: 'route'}}));
            history.push(`/tasks/${cbdata.data.value}`);
          break;
        case 'notifyItemSelect':
          if(cbdata.data.value !=='all'){
            store.dispatch(updatedNotiMessage({id: cbdata.data.value, read: true, readAt: new Date()}))
          }
          break;
        default: 
          console.log(`unknown action from popover`);
          break;
      }
    }else{
      console.info('user not confirm');
    }
  }