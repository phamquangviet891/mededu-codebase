import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonItem, IonList, IonProgressBar, IonText, IonToolbar } from "@ionic/react";
import { chevronDown, chevronUp, fileTrayFullOutline, informationCircle, personCircle, statsChartSharp, timerOutline, timerSharp } from "ionicons/icons";
import { useState } from "react";
import { useAppSelector } from "../../redux/hook";
import { RootState } from "../../redux/rootReducer";
import './TaskDetail.css';
interface TaskDetailProp{
    taskId: string;
}
export const TaskDetail: React.FC<TaskDetailProp> = ({taskId})=>{
    const taskItem = useAppSelector((state:RootState)=>state.taskItems.find(el=>el.id === taskId));
    const [expand,setExpand] = useState<boolean>(false);
    return (
    
        
        
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle>
                        <IonToolbar>
                            <IonItem slot="start" lines="none"><IonIcon title="Nhiệm vụ" icon={fileTrayFullOutline} color={"danger"} /><h3>{taskItem?.name}</h3></IonItem>
                            <IonButtons slot="end">
                                <IonButton onClick={(e)=>{setExpand(old=>!old)}}><IonIcon color="danger" icon={expand ===false?chevronDown:chevronUp}/></IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonCardTitle>
                    <IonCardSubtitle>
                        <IonIcon icon={timerOutline} title="Bắt đầu"/><IonText>Bắt đầu:{taskItem?.beginDate.toLocaleString()}</IonText>
                    </IonCardSubtitle>
                </IonCardHeader>
                {expand === true?
                <IonCardContent>
                    <IonList>
                        <IonItem lines="none">
                            <IonIcon title="Mô tả công việc" icon={informationCircle} color={"success"}/><IonText color={"tertiary"}><h4>{taskItem?.description}</h4></IonText>
                        </IonItem>
                        <IonItem lines="none">
                            <IonIcon title="Người giao" icon={personCircle} color={"success"}/><IonText color={"tertiary"}><h4>{taskItem?.grantPerson}</h4></IonText>
                        </IonItem>
                        <IonItem lines="none" title="Hạn hoàn thành">
                            <IonIcon title="Hạn hoàn thành" icon={timerSharp} color={"success"}/><IonText color={"tertiary"}><h4>{taskItem?.deadLine.toLocaleString()}</h4></IonText>
                        </IonItem>
                        <IonItem lines="none">
                            <IonIcon title="Tiến độ" icon={statsChartSharp} color={"success"}/><IonProgressBar value={((taskItem?.percentComplete||0)/100)} buffer={1}></IonProgressBar>
                        </IonItem>
                    </IonList>
                    
                </IonCardContent>:""}
            </IonCard>
            
    );       
    
    
}