import { IonItem, IonList } from "@ionic/react";
import { useAppSelector } from "../../redux/hook";
import { RootState } from "../../redux/rootReducer";
import { TaskDetail } from "./TaskDetail";

export const TaskList:React.FC = ()=>{
    const tasks = useAppSelector((state:RootState)=> state.taskItems)
    return (
        <IonList>
            {tasks.map((task)=><TaskDetail key={task.id} taskId = {task.id}/>)}
        </IonList>
    );
}