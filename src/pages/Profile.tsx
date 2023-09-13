import { IonPage, IonHeader, IonContent, useIonPopover, useIonToast, IonButton, IonButtons, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonModal, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { AxiosError } from "axios";
import { informationCircle, key, listOutline } from "ionicons/icons";
import { useRef, useState } from "react";
import { FuncWithCallbackData } from "../appconfigs/data.types/app.types";
import { myapp } from "../appconfigs/default";
import { EmailPopover, MyAppToolbar, NofifyPopover, TaskPopover, UserPopover } from "../components/general/CommonComponent";
import { ApiLogin } from "../data-providers/backend-call-Fn";
import { useAppDispatch } from "../redux/hook";
import { setUser, userInitState } from "../redux/slices/userSlice";

const Profile: React.FC = () => {
    const modal = useRef<HTMLIonModalElement>(null);
    const inputUsername = useRef<HTMLIonInputElement>(null);
    const inputPassword = useRef<HTMLIonInputElement>(null);
    const dispatch = useAppDispatch();
    const [isLoginModalShow,setIsLoginModalShow] = useState<boolean>(false);
    const [presentToast] = useIonToast();
    const [presentNotifyList, dissmisNotifyList] = useIonPopover(NofifyPopover,{
        onDismiss: (data: any, role: string) => dissmisNotifyList(data, role),
        
    });
    const [presentEmailList, dissmisEmailList] = useIonPopover(EmailPopover,{
        onDismiss: (data: any, role: string) => dissmisEmailList(data, role),
    });
    const [presentTaskList, dissmisTaskList] = useIonPopover(TaskPopover,{
        onDismiss: (data: any, role: string) => dissmisTaskList(data, role),
    });
    const [presentUserAction, dissmisUserAction] = useIonPopover(UserPopover,{
        onDismiss: (data: any, role: string) => dissmisUserAction(data, role),
        dismissOnSelect: true,
        //truyen custom function de nhan biet user bam item nao 
        onSelectItem: (data:FuncWithCallbackData)=>{
        selectItemFn(data);
        }
    });
    function modalConfirm() {
        modal.current?.dismiss({
        username:inputUsername.current?.value,
        password: inputPassword.current?.value
        }, 'confirm');
    }

    async function onModalWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
        setIsLoginModalShow(false);
        if (ev.detail.role === 'confirm') {
        console.log('dang nhap voi thong tin:'+ev.detail.data);
        let {username, password} = ev.detail.data;
        if( username === "" || password === "" || password.length < myapp.rules.password.minLength || password.length > myapp.rules.password.maxLength){
            presentToast(`Tên và mật khẩu không được để trống hoặc độ dài mật khẩu không hợp lệ!`,3000)
        }else{
            console.info(`Tien hanh goi api dang nhap`);
            try{
            let res = await ApiLogin({username, password});
            if([200].indexOf(res.status) !==-1){
                //thuc hien lay du lieu thanh coong
                presentToast(`Đăng nhập thành công!`, 3000);
                let result = res.data;
                dispatch(setUser(result));
                console.log(result);
            }
            } catch (error: AxiosError|any|unknown) {
            console.log(error);
            presentToast(`Lỗi kết nối, vui lòng kiểm tra internet`);
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
    function selectItemFn(cbdata: FuncWithCallbackData){
        console.log(`Item on popover, menuKey: ${cbdata.data.menuKey} action: ${cbdata.data.actionType} role: ${cbdata.role}`);
        //đoạn xử lý cho các tuy chon của người dùng trên popover
        if(cbdata.role === 'confirm'){
        switch (cbdata.data.menuKey){
            //phan xu ly login logout
            case 'userLogin':
            console.info('show login modal');
            setIsLoginModalShow(true);
            break;
            case 'userLogout':
            console.info('xu ly luong log out');
            dispatch(setUser(userInitState));
            break;  
            //end phan xu ly login logout
            default: 
            console.log(`unknown action from popover`);
            break;
        }
        }else{
        console.info('user not confirm');
        }
    }
    function handleNotifyClick(e: any){
        presentNotifyList({
        event: e,
        onDidDismiss: (e: CustomEvent) => console.log(`Popover dismissed with role: ${e.detail.role}`),
        })
    }
    function handleEmailClick(e: any){
        presentEmailList({
        event: e,
        onDidDismiss: (e: CustomEvent) => console.log(`Popover dismissed with role: ${e.detail.role}`),
        })
    }
    function handleTaskClick(e: any){
        presentTaskList({
        event: e,
        onDidDismiss: (e: CustomEvent) => console.log(`Popover dismissed with role: ${e.detail.role}`),
        })
    }
    function handleProfileClick(e: any){
        presentUserAction({
        event: e,
        dismissOnSelect: true,
        onDidDismiss: (e: CustomEvent) => console.log(`Popover dismissed with role: ${JSON.stringify(e.detail)}`),
        })
    }
    return (<IonPage>
        <IonHeader>
          <MyAppToolbar 
            isButton={false} 
            title={myapp.identify.APP_NAME}
            icon={listOutline}
            lefBtnCallback = {(e: CustomEvent)=>{
              
            }}
            notifyFnClick = {(e: CustomEvent)=>{
              handleNotifyClick(e)
            }}
            mailFnClick = {(e: CustomEvent)=>{
              handleEmailClick(e);
            }}
            taskFnClick = {(e: CustomEvent)=>{
              handleTaskClick(e);
            }}
            profileFnClick = {(e: CustomEvent)=>{
              handleProfileClick(e);
            }}
          />
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <MyAppToolbar 
              isButton={true} 
              title={myapp.identify.APP_NAME}
              icon={listOutline}
              lefBtnCallback = {(e: CustomEvent)=>{
                alert(e);
              }}
              notifyFnClick = {(e: CustomEvent)=>{
                handleNotifyClick(e);
              }}
              mailFnClick = {(e: CustomEvent)=>{
                handleEmailClick(e);
              }}
              taskFnClick = {(e: CustomEvent)=>{
                handleTaskClick(e);
              }}
              profileFnClick = {(e: CustomEvent)=>{
                handleProfileClick(e);
              }}
            />
          </IonHeader>
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
        </IonContent>

    </IonPage>)
}
export default Profile;