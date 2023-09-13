import { IonToolbar, IonTitle, IonItem, IonButton, IonIcon, IonButtons, IonItemDivider, IonItemGroup, IonLabel, IonList, IonListHeader, IonText, IonBadge, IonContent, IonCard, IonCardHeader, IonCardContent, IonFooter, IonFabButton, IonFab, IonCardSubtitle, IonCardTitle, IonRow } from "@ionic/react"
import { myapp } from "../../appconfigs/default";
import { chevronDown, listCircleOutline, mail, notifications, notificationsCircle, personCircle, ribbonSharp, sparkles, star } from 'ionicons/icons';
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { RootState } from "../../redux/rootReducer";
import { useEffect, useState } from "react";
import { setUIStateKey } from "../../redux/slices/uiSlice";
import { loadNotify } from "../../redux/slices/notifySlice";
import './CommonComponent.css';
import { loadTask } from "../../redux/slices/taskSlice";
import { MyApp_GetColor } from "../../utils/reuseFn";
import { FuncWithCallbackData, FuncWithCallbackPopoverProp, NotifyDefine, SimpleTaskItemProp } from "../../appconfigs/data.types/app.types";

interface AppToolbarProp{
    title?: string;
    icon?: string;
    isButton: boolean|false;
    lefBtnCallback: (e: CustomEvent)=>void; 
    notifyFnClick: (e: CustomEvent)=>void;
    mailFnClick: (e: CustomEvent)=>void;
    taskFnClick:(e: CustomEvent)=>void;
    profileFnClick: (e: CustomEvent)=>void;
}
export const MyAppToolbar: React.FC<AppToolbarProp> = ({
    title, 
    icon,
    isButton, 
    lefBtnCallback,
    notifyFnClick,
    mailFnClick,
    taskFnClick,
    profileFnClick
})=>{
    const dispatch = useAppDispatch();
    const user = useAppSelector((state: RootState)=> state.user);
    const countNotify = useAppSelector((state:RootState)=>state.notifyItems.filter(el=>(el.read === false)).length);
    const countTask = useAppSelector((state:RootState)=>state.taskItems.filter(el=>(el.read === false)).length);
    useEffect(()=>{
      if(user.accessInfo !== null){
        dispatch(loadNotify(user.accessInfo!.token));
        dispatch(loadTask(user.accessInfo!.token));
      }
      
    },[user.accessInfo]);
    return (
    <IonToolbar>
        
        {isButton === true?(
            <IonButton slot="start" onClick={(e:any)=>lefBtnCallback(e)}>{icon?<IonIcon icon={icon}/>:""}{title?title : myapp.identify.APP_NAME}</IonButton>
            ):(
            <IonTitle slot="start">{icon?<IonIcon icon={icon}/>:""}{title?title : myapp.identify.APP_NAME}</IonTitle>
            )
        }
        <IonButtons slot="end">
            
              <IonButton 
                className="ion-button-customize overflow-allow"
                onClick={(e:any)=>notifyFnClick(e)}
              >
                <IonIcon icon={notifications} color="danger"/>
                <IonBadge className="ion-badge-customize" color={"success"}>{countNotify}</IonBadge>
              </IonButton>
              
            
            <IonButton  onClick={(e:any)=>mailFnClick(e)}><IonIcon icon={mail} color="danger"></IonIcon></IonButton>
            <IonButton 
              onClick={(e:any)=>taskFnClick(e)}
            >
              <IonIcon icon={listCircleOutline} color="danger" />
              <IonBadge className="ion-badge-customize" color={"success"}>{countTask}</IonBadge>
            </IonButton>
            <IonButton onClick={(e:any)=>profileFnClick(e)}><IonIcon icon={personCircle} color={user.accessInfo !==null?"success":"danger"}></IonIcon></IonButton>
        </IonButtons>
        
    </IonToolbar>
    );
} 

export const NofifyPopover: React.FC<FuncWithCallbackData> = ({onSelectedItem}) => {
  const notifies = useAppSelector<Array<NotifyDefine>>((state:RootState)=>state.notifyItems.filter(el=>(el.read ===false)));  
    return (
        <IonList>
          <IonItemGroup>
            <IonItemDivider>
              <IonItem lines="none" onClick={(e)=>{
              onSelectedItem({data:{
                menuKey: "notifyItemSelect",
                value: 'all',
                actionType: 'click',
              }, role: 'confirm'});
            }}>
                <IonIcon slot={"start"} color = {"warning"} icon={notificationsCircle}/>
                <IonText slot={"end"}>{`Bạn có ${notifies.length} thông báo mới`}</IonText>
              </IonItem>
            </IonItemDivider>
        {
          notifies.map(el=>
          <IonItem 
            key={el.id}
            lines='none' button={true} detail={false}
            onClick={(e)=>{
              onSelectedItem({data:{
                menuKey: "notifyItemSelect",
                value: el.id,
                actionType: 'click',
              }, role: 'confirm'});
            }}
          >
            <div>
              <IonRow>
                <IonCardTitle>{el.read === false?<IonIcon icon = {sparkles} color={"warning"}/>:""}{el.title}</IonCardTitle>
                <IonCardSubtitle>{el.notifyTime.toLocaleString()}</IonCardSubtitle>
              </IonRow>
              <IonCardContent>{el.content}</IonCardContent>
            </div>
          </IonItem>)
        }
          </IonItemGroup>
        </IonList>
    );
  }
export const EmailPopover: React.FC<any> = () => {
    const [emails, setEmails] = useState<any[]>([]);
    return (
        <IonList>
          <IonListHeader>Danh sach emails</IonListHeader>
        {
          
        }</IonList>
    );
  }
export const TaskPopover: React.FC<FuncWithCallbackData> = ({onSelectedItem}) => {
    const tasks = useAppSelector((state:RootState)=>state.taskItems);
    return (
        <IonList>
          <IonItemGroup>
          <IonItemDivider>
            <IonItem lines="none" onClick={(e)=>{
              onSelectedItem({data:{
                menuKey: "taskItemSelect",
                value: 'all',
                actionType: 'click',
              }, role: 'confirm'});
            }}>
              <IonIcon slot={"start"} icon={star} color={"warning"}/>
              <IonText color={"danger"}>
              <h4>{`Bạn có ${tasks.length} nhiệm vụ mới`}</h4> 
              </IonText>
            </IonItem>
        </IonItemDivider>
          {
          tasks.map(el=><TaskItem
             key={el.id} 
             onSelectedItem={onSelectedItem} 
             task={el}/>
            )
          }
          <IonItemDivider/>
          <IonItem 
            lines="none" button={true} 
            detail={false} 
            onClick={(e)=>{
              onSelectedItem({data:{
                menuKey: "taskItemSelect",
                value: 'all',
                actionType: 'click',
              }, role: 'confirm'});
            }}
          >
              Hiển thị hết
          </IonItem>
          </IonItemGroup>
          
        </IonList>
    );
  }

export const UserPopover: React.FC<FuncWithCallbackPopoverProp> = ({onSelectedItem: onSelectItem}) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state: RootState)=>state.user);
    return (
      
        <IonList>
          {user.accessInfo !== null?
          (<><IonItemGroup>
            <IonItemDivider>
              <IonIcon icon={ribbonSharp} color={"warning"}/><IonText color={"primary"}><h3>{user.userProfile.activatedRole.role.name}</h3></IonText>
            </IonItemDivider>
            <IonItem lines='none' button={true} detail={false} onClick={()=>{
              dispatch(setUIStateKey({key:'showUserActionPopover',value:true}));
              onSelectItem({
                data: {
                  menuKey: 'userProfile',
                  actionType: 'click',
                },
                role: 'confirm'});
            }
          }>{user.userProfile.username}</IonItem>
          </IonItemGroup>
          <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Thao tác tài khoản</IonLabel>
          </IonItemDivider>
          <IonItem lines='none' button={true} detail={false}
            onClick={(e)=>{
              onSelectItem({data:{
                menuKey: "userLogout",
                actionType: 'click',
              }, role: 'confirm'});
            }}
          >Đăng xuất</IonItem>
          </IonItemGroup>
          </>)
          :
          (
          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>Thao tác tài khoản</IonLabel>
            </IonItemDivider>
            <IonItem lines='none' button={true} detail={false}
              onClick={(e)=>{
                onSelectItem({data:{
                  menuKey: "userLogin",
                  actionType: 'click',
                }, role: 'confirm'});
              }}
            >Đăng nhập</IonItem>
            </IonItemGroup>)
          }
        </IonList>
      
    );
}

export const TaskItem: React.FC<SimpleTaskItemProp> = ({task,onSelectedItem})=>{
  return (
  <IonItem 
    lines='none' button={true} detail={false}
    onClick={(e)=>{
      onSelectedItem({data:{
        menuKey: "taskItemSelect",
        value: task.id,
        actionType: 'click',
      }, role: 'confirm'});
    }}
  >
    <IonLabel slot="start">{task.name}</IonLabel>
    <br/>
    <IonText slot="end"><h6>{task.deadLine.toLocaleDateString()}</h6></IonText>
  </IonItem>)
}
