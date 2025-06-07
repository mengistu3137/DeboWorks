import { IKContext, IKImage, IKUpload } from 'imagekitio-react';
import axios from "axios"
import {  toast } from 'react-toastify';
import { useRef, useState } from "react";
const authenticator =  async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

const Uploads = ({ children, type, setProgress, setData ,accept}) => {
const ref=useRef(null)    
 const onError = (err) => {
    console.log(err)
    toast.error("Failed to upload")
  }
  const onSuccess = (res) => {
    console.log(res)
      toast.success("Successfuly uploaded")
      
    setData(res)
  }

const onUploadProgress = (progress) => {
    setProgress(Math.round(progress.loaded / progress.total * 100)+"%")

  }
  return (
   
            <IKContext 
        publicKey={import.meta.env.VITE_IK_PUBLIC_KEY} 
        urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT} 
        authenticator={authenticator} 
        >
            
          <IKUpload
              useUniqueFileName
              onError={onError}
              onSuccess={onSuccess}
              onUploadProgress={onUploadProgress}
              className="hidden"
              ref={ref}
              type={`${type}/*`}
              accept={accept}

              

              
          />
          <div
              onClick={() => { ref.current.click() }}
          >
              {children}
          </div>
      </IKContext>

  )
}

export default Uploads