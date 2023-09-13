import { IonContent, IonHeader, 
  IonPage, 
  useIonPopover } from '@ionic/react';
import { listOutline } from 'ionicons/icons';
import { myapp } from '../appconfigs/default';
import { EmailPopover, MyAppToolbar, NofifyPopover, TaskPopover, UserPopover } from '../components/general/CommonComponent';
import {} from '../components/general/CommonComponent'
import './Home.css';
import { selectItemFn } from '../utils/reuseFn';
import { FuncWithCallbackData } from '../appconfigs/data.types/app.types';
import { useHistory } from 'react-router';
import SimpleEditor from '../components/test/SimpleEdittor';



const Home: React.FC = () => {
  const history = useHistory();
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
        <SimpleEditor />
      </IonContent>
    </IonPage>
  );
};

export default Home;
