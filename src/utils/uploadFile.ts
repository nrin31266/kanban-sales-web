import Resizer from "react-image-file-resizer";
import { replaceNameFile } from "./replaceName";
import { message, UploadFile } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/firebaseConfig";


// Resize a single file
const resizeFile = (file: File) =>
  new Promise<File>((resolve) => {
    Resizer.imageFileResizer(
      file,
      1080,
      720,
      "JPEG",
      90,
      0,
      (resizedFile) => resolve(resizedFile as File),
      "file"
    );
  });

// Upload a single file and return its URL
export const uploadFile = async (file: File): Promise<string> => {
  try {
    const resizedFile = await resizeFile(file);
    const fileName = replaceNameFile(resizedFile.name);
    const storageRef = ref(storage, `images/${fileName}`);
    await uploadBytes(storageRef, resizedFile);
    return await getDownloadURL(storageRef);
  } catch (error) {
    message.error("Error uploading file!");
    throw error;
  }
};

// Upload multiple files and return their URLs
export const uploadFiles = async (files: File[]): Promise<string[]> => {
  try {
    const uploadPromises = files.map(uploadFile);
    const imagesUrl = await Promise.all(uploadPromises);
    return imagesUrl.filter((url): url is string => url !== null);
  } catch (error) {
    message.error("Error uploading one or more files!");
    throw error;
  }
};

export const processFileList = async (fileList: any[]): Promise<string[]> => {
  const filesToUpload: any[] = [];
  const existingUrls: string[] = [];

  // Separate files that need to be uploaded and existing URLs
  fileList.forEach((file) => {
    if (file.originFileObj) filesToUpload.push(file.originFileObj);
    else if (file.url) existingUrls.push(file.url);
  });

  // Upload new files and combine URLs
  if (filesToUpload.length > 0) {
    const uploadedUrls = await uploadFiles(filesToUpload);
    if (uploadedUrls) return [...existingUrls, ...uploadedUrls];
  }
  return existingUrls;
};

export const changeFileListToUpload = (
  newFileList: UploadFile[]
): UploadFile[] => {
  const items: UploadFile[] = newFileList.map((item) =>
    item.originFileObj
      ? {
          ...item,
          url: URL.createObjectURL(item.originFileObj),
          status: "done",
        }
      : { ...item }
  );
  return items;
};

