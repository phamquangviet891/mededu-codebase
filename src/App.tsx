import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonModal, IonRouterOutlet, IonText, IonTitle, IonToolbar, isPlatform, setupIonicReact, useIonAlert, useIonToast } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { OverlayEventDetail } from '@ionic/core/components';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import { GetOrCreateStore } from './data-providers/localstorage';
import { myapp } from './appconfigs/default';
import { setUser, userInitState } from './redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from './redux/hook';
import { useContext, useEffect, useRef, useState } from 'react';
import Task from './pages/Task';
import { SocketContext } from './socket.clients/context/socket';
import { socket_events } from './socket.clients/socket.handler';
import {DeviceUUID} from 'device-uuid';
import { key, informationCircle } from 'ionicons/icons';
import { RootState } from './redux/rootReducer';
import { calculateExpireEpoche } from './utils/reuseFn';
import { ApiLogin } from './data-providers/backend-call-Fn';
import { setUIStateKey } from './redux/slices/uiSlice';
import { AxiosError } from 'axios';

setupIonicReact();

const App: React.FC = () => { 
  const dispatch = useAppDispatch();
  const socket = useContext(SocketContext);
  const [joined, setJoined] = useState<boolean>(false);
  const modal = useRef<HTMLIonModalElement>(null);
  const inputUsername = useRef<HTMLIonInputElement>(null);
  const inputPassword = useRef<HTMLIonInputElement>(null);
  const isLoginModalShow = useAppSelector<boolean>((state:RootState)=>state.ui.showlogin_modal);
  const [presentToast] = useIonToast();
  const [presentAlert,dismissAlert] = useIonAlert();
  function modalConfirm() {
    modal.current?.dismiss({
      username:inputUsername.current?.value,
      password: inputPassword.current?.value
    }, 'confirm');
  }
  
  
  async function onModalWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    dispatch(setUIStateKey({key: 'showlogin_modal', value: false}));
    if (ev.detail.role === 'confirm') {
      console.log('dang nhap voi thong tin:'+ev.detail.data);
      let {username, password} = ev.detail.data;
      if( username === "" || password === "" || password.length < myapp.rules.password.minLength || password.length > myapp.rules.password.maxLength){
        presentToast(`Tên và mật khẩu không được để trống hoặc độ dài mật khẩu không hợp lệ!`,3000)
      }else{
        presentToast(`Đang đăng nhập vào hệ thống`, 2000);
        try{
          let res = await ApiLogin({username, password});
          if([200].indexOf(res.status) !==-1){
            //thuc hien lay du lieu thanh coong
            presentToast(`Đăng nhập thành công!`, 3000);
            let result = res.data;
            dispatch(setUser(result));
            //lưu thong tin nguoi dùng đăng nhập cục bộ
            let localStorage = await GetOrCreateStore();
            await localStorage.set(myapp.identify.STORAGE_USER_KEY, JSON.stringify(result));
            //luu thong tin ngay phai dang nhap lai
            await localStorage.set(myapp.rules.store_authenticate.key, calculateExpireEpoche(myapp.rules.store_authenticate));
          }
        } catch (error: AxiosError|any|unknown) {
          console.log(error);
          presentAlert({
            header:"Thông báo",
            subHeader:"Lỗi đăng nhập",
            message:"Lỗi kết nối với hệ thống!",
            buttons:[{
              text: 'OK',
              role: 'confirm',
              handler: () => {
                dismissAlert();
              },
            }],
            onDidDismiss(event) {
              console.log("Hello", event);
            },
          }
          );
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
          console.log(error.config);
        }
      }
    }
  }
  function handleConnect(){
    console.log("Tab1 socket connect event", socket?.connected);
    setJoined(socket?.connected!);
    if(socket?.connected){
      let duuid: string;
      if(isPlatform('mobileweb')|| isPlatform('desktop')|| isPlatform('pwa')){
        duuid = new DeviceUUID().get();
        console.log(duuid);
        if(socket?.connected){
          socket.emit("HUMAN_DEVICE_ONLINE",{UUID: duuid,extinfo: "APP"});
        }else{
          console.log('socket not connect');
        }
      }
      socket.on("STATUS",(message:any)=>{
        console.log("DATA EVENT", message.mess);
      });
    }else{
      socket?.off('HUMAN_DEVICE_ONLINE');
    }
  }
  useEffect(()=>{
    socket?.on("connect", handleConnect);
    return ()=>{
      for (const event of socket_events) {
        console.log(`HUY Dang ky su kien: ${event.name}`);
        socket?.off(event.name);
      }
    }
  },[joined]);
  useEffect(()=>{
    console.log(`Init Task when app start`);
    const loadPersistData = async()=>{
        let localIonStore = await GetOrCreateStore();
        let info = await localIonStore.get(myapp.identify.STORAGE_USER_KEY);
        if(info === undefined || info === '' || info === null){
          dispatch(setUser(userInitState));
        }else{
          let exp_epoche = await localIonStore.get(myapp.rules.store_authenticate.key);
          if(exp_epoche == null || exp_epoche === undefined || exp_epoche === ""){
            console.log(`Khong thay thoi diem het han`);
            await localIonStore.remove(myapp.identify.STORAGE_USER_KEY);
          }else{
            let epoch_now = Math.floor(Date.now()/1000);
            if(epoch_now >= exp_epoche){
              //can phai dang nhap lai
              console.log(`Hết hạn đăng nhập tự động ${new Date(exp_epoche * 1000).toLocaleString()} => Cần đăng nhập lại`);
              await localIonStore.remove(myapp.identify.STORAGE_USER_KEY);
              dispatch(setUser(userInitState));
            }else{
              dispatch(setUser(JSON.parse(info)));
              console.log(`Hạn đăng nhập tự động ${new Date(exp_epoche * 1000).toLocaleString()} => Sử dụng thông tin đã lưu trữ`);
            }
          }
          
        }
    }
    loadPersistData();
  },[]);
  return (
    <SocketContext.Provider value={socket}>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route path="/tasks/:id">
            <Task />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
      <IonModal ref={modal} isOpen = {isLoginModalShow} onWillDismiss={(ev) => onModalWillDismiss(ev)}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.current?.dismiss()}>Hủy</IonButton>
              </IonButtons>
              <IonTitle><IonIcon icon={key} color={"danger"}/>ĐĂNG NHẬP</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => modalConfirm()}>
                  Đồng ý
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Nhập tên</IonLabel>
              <IonInput ref={inputUsername} type="text" placeholder="Tên đăng nhập" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Mật khẩu</IonLabel>
              <IonInput ref={inputPassword} type="password" placeholder="Mật khẩu" />
            </IonItem>
            <IonItemDivider>
              <IonIcon icon={informationCircle} color={"primary"} /><IonText color={"danger"}>{`Độ dài mật khẩu [tối thiểu: ${myapp.rules.password.minLength}, tối đa ${myapp.rules.password.maxLength}] ký tự`}</IonText>
            </IonItemDivider>
          </IonContent>
        </IonModal>
    </IonApp>
    </SocketContext.Provider>
);
}

export default App;

