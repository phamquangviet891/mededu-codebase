import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonRadio, IonRadioGroup, IonSegment, IonSegmentButton } from "@ionic/react"
import { camera } from "ionicons/icons";
import { useRef, useState } from "react";
import { ApiUploadFile } from "../../data-providers/backend-call-Fn";
import { useAppSelector } from "../../redux/hook";
import { RootState } from "../../redux/rootReducer";
import { Editor } from '@tinymce/tinymce-react';
import './uploadFile.css';
import { myapp } from "../../appconfigs/default";
import { AxiosResponse } from "axios";
export const UploadFileForm: React.FC = ()=>{
    const user = useAppSelector((state: RootState)=>state.user);
    const [isPriv,setIsPriv] = useState<boolean>(true);
    const openFileDialog = () => {
        (document as any).getElementById("file-upload").click();
     };
     
     const setImage = (_event: any) => {
       let f = _event.target.files![0];
       console.info(f);
       ApiUploadFile(user.accessInfo?.token!,f).then(res=> {console.log(res)}).catch(err=>{console.log(err)})
     }
    const editorRef = useRef<any>(null);
    const log = (e:any) => {
        console.log(e);
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };
    
    return <IonContent>
        <input
        type="file"
        id="file-upload"
        style={{ display: "none" }}
        onChange={setImage}
        />
        <IonRadioGroup value="priv" onIonChange={e=>setIsPriv(e.detail.value ==="priv")}>
            <IonItem lines="none">
                <IonItem slot="start" lines="none">
                    <IonLabel>Cá nhân</IonLabel>
                    <IonRadio slot="end" value="priv"></IonRadio>
                </IonItem>
                <IonItem slot ="end" lines="none">
                    <IonLabel>Dùng chung</IonLabel>
                    <IonRadio slot="end" value="publ"></IonRadio>
                </IonItem>
            </IonItem>
        </IonRadioGroup>
        <IonButton onClick={openFileDialog}>
            <IonIcon slot="icon-only" icon={camera}></IonIcon>
        </IonButton>
        <Editor
        tinymceScriptSrc={myapp.backend.BASE_API_URL + '/tinymce/tinymce.min.js'}
        
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue='<p>This is the initial content of the editor.</p>'
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | autolink link image | code | table | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          images_file_types: 'jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp',
          file_picker_types: 'file image media',
          block_unsupported_drop: true,
          file_picker_callback: function (cb, value, meta) {
            
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
        
            /*
              Note: In modern browsers input[type="file"] is functional without
              even adding it to the DOM, but that might not be the case in some older
              or quirky browsers like IE, so you might want to add it to the DOM
              just in case, and visually hide it. And do not forget do remove it
              once you do not need it anymore.
            */
        
            input.onchange = function (_event: any){
                let f = _event.target.files![0];
                var reader = new FileReader();
                reader.onload = function () {
                    /*
                    Note: Now we need to register the blob in TinyMCEs image blob
                    registry. In the next release this part hopefully won't be
                    necessary, as we are looking to handle it internally.
                    */
                    var id = 'blobid' + (new Date()).getTime();
                    var blobCache =  editorRef.current!.activeEditor.editorUpload.blobCache;
                    var base64 = (reader.result as string).split(',')[1];
                    var blobInfo = blobCache.create(id, f, base64);
                    blobCache.add(blobInfo);
        
                    /* call the callback and populate the Title field with the file name */
                    cb(blobInfo.blobUri(), { title: f.name });
                };
                reader.readAsDataURL(f);
            };
            input.click();
            if (meta.filetype == 'file') {
                cb('mypage.html', {text: 'My text'});
              }
          
              // Provide image and alt text for the image dialog
              if (meta.filetype == 'image') {
                cb('myimage.jpg', {alt: 'My alt text'});
              }
          
              // Provide alternative source and posted for the media dialog
              if (meta.filetype == 'media') {
                cb('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
              }
          },
          images_upload_handler: async(data, progress):Promise<any>=>{
            //thuc hien up load 
            console.log('Thu hien upload', data.blob());
            try{
                let resp: AxiosResponse = await ApiUploadFile(user.accessInfo?.token!, data);
                console.log(resp);
                if([200].indexOf(resp.status) !== -1){
                    return Promise.resolve(resp.data.files[0].url_get);
                }else{
                    return Promise.reject('not success');
                }
            }catch(error){
                console.log('Thu hien upload');
                return Promise.reject(error);
            }
            
            
          }
        }}

      />
      <IonButton onClick={log}>Log editor content</IonButton>
    </IonContent>
}