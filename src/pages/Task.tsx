import { IonContent, IonHeader, 
  IonPage, 
  useIonPopover } from '@ionic/react';
import { chevronBack, listOutline } from 'ionicons/icons';
import { myapp } from '../appconfigs/default';
import { EmailPopover, MyAppToolbar, NofifyPopover, TaskPopover, UserPopover } from '../components/general/CommonComponent';
import {} from '../components/general/CommonComponent'
import './Task.css';
import { useHistory, useParams } from 'react-router';
import { TaskList } from '../components/general/TaskList';
import { TaskDetail } from '../components/general/TaskDetail';
import { FuncWithCallbackData } from '../appconfigs/data.types/app.types';
import { selectItemFn } from '../utils/reuseFn';
import { useAppDispatch } from '../redux/hook';


const Task: React.FC = () => {
  const params = useParams<{id:string}>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  
  console.log(params.id);
  //#region cac ham mac dinh cho tat ca cac trang
  const [presentNotifyList, dissmisNotifyList] = useIonPopover(NofifyPopover,{
    onDismiss: (data: any, role: string) => dissmisNotifyList(data, role),
    dismissOnSelect: true,
    //truyen custom function de nhan biet user bam item nao 
    onSelectedItem: (data:FuncWithCallbackData)=>{
      selectItemFn(history,data);
    }
  });
  const [presentEmailList, dissmisEmailList] = useIonPopover(EmailPopover,{
    onDismiss: (data: any, role: string) => dissmisEmailList(data, role),
    dismissOnSelect: true,
    //truyen custom function de nhan biet user bam item nao 
    onSelectedItem: (data:FuncWithCallbackData)=>{
      selectItemFn(history,data);
    }
  });
  const [presentTaskList, dissmisTaskList] = useIonPopover(TaskPopover,{
    onDismiss: (data: any, role: string) => dissmisTaskList(data, role),
    dismissOnSelect: true,
    //truyen custom function de nhan biet user bam item nao 
    onSelectedItem: (data:FuncWithCallbackData)=>{
      selectItemFn(history,data);
    }
  });
  const [presentUserAction, dissmisUserAction] = useIonPopover(UserPopover,{
    onDismiss: (data: any, role: string) => dissmisUserAction(data, role),
    dismissOnSelect: true,
    //truyen custom function de nhan biet user bam item nao 
    onSelectedItem: (data:FuncWithCallbackData)=>{
      selectItemFn(history,data);
    }
  });
  
  
  function handleNotifyClick(e: any){
    presentNotifyList({
      event: e,
      dismissOnSelect: true,
      onDidDismiss: (e: CustomEvent) => console.log(`Popover dismissed with role: ${e.detail.role}`),
    })
  }
  function handleEmailClick(e: any){
    presentEmailList({
      event: e,
      dismissOnSelect: true,
      onDidDismiss: (e: CustomEvent) => console.log(`Popover dismissed with role: ${e.detail.role}`),
    })
  }
  function handleTaskClick(e: any){
    presentTaskList({
      event: e,
      dismissOnSelect: true,
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
  //#endregion
  return (
    <IonPage>
      <IonHeader>
        <MyAppToolbar 
          isButton={true} 
          title={"HOME"}
          icon={chevronBack}
          lefBtnCallback = {(e: CustomEvent)=>{
            history.push('/');
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
        
        {params.id === 'all'?<TaskList/>:<TaskDetail taskId={params.id}/>}
      </IonContent>
    </IonPage>
  );
};

export default Task;
