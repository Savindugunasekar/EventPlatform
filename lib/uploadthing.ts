//this code is copied from uploadthing docs
// import {
//     generateUploadButton,
//     generateUploadDropzone,
//   } from "@uploadthing/react";
   
//   import type { OurFileRouter } from "@/app/api/uploadthing/core";
   
//   export const UploadButton = generateUploadButton<OurFileRouter>();
//   export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

//code has been changed to 

import { generateReactHelpers } from "@uploadthing/react/hooks";
 
import type { OurFileRouter } from "@/app/api/uploadthing/core";
 
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();