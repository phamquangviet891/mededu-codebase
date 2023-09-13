
/**
 * Giao tiep du lieu khi nguoi dung bam vao item
 */
export  interface PopoverActionData{
    nenuKey?: string; 
    actionType?:string; 
    value?: any;
    [prop:string]: any;
  }
export interface FuncWithCallbackData{
    data: PopoverActionData; 
    role: string;
    [prop:string]: any;
}
export interface FuncWithCallbackPopoverProp{
    onSelectedItem: (paramData: FuncWithCallbackData)=>void;
}
export interface SimpleTaskItemProp{
    onSelectedItem: (pramData: FuncWithCallbackData)=>void;
    task: TaskDefine;
}
export interface TaskDefine{
    id: string;
    name: string;
    description: string;
    relationsUser?: Array<any>;
    beginDate: Date;
    deadLine: Date;
    percentComplete: number;
    read?: boolean;
    grantPerson?: any;
    [prop:string]: any;
}
export interface NotifyDefine {
    id: string;
    title: string;
    subject?: string;
    from?: string;
    to?: Array<string>;
    content: string;
    notifyTime: Date;
    read: boolean|false;
    readAt?: Date|null;
    [prop:string]: any;
}