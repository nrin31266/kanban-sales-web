import { message } from "antd";
import { storage } from "../firebase/firebaseConfig";
import { replaceNameFile } from "./replaceName";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Resizer from "react-image-file-resizer";

// Resize file
const resizeFile = (file: any) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1080,
      720,
      "JPEG",
      90,
      0,
      (newFile) => {
        resolve(newFile);
      },
      "file",
    );
  });

export const uploadFile = async (file: any) => {
  try {
    const newFile: any = await resizeFile(file);
    const newFileName = replaceNameFile(newFile.name);

    const storageRef = ref(storage, `images/${newFileName}`);
    const res = await uploadBytes(storageRef, newFile);

    if (res) {
      return getDownloadURL(storageRef);
    } else {
      message.error("Error during file upload!");
      return "Error upload";
    }
  } catch (error) {
    message.error("Error uploading file!");
    return "Error upload";
  }
};


export const uploadFiles = async (files: any[]) => {
  const uploadPromises = files.map(async (file: any) => {
    try {
      const newFile: any = await resizeFile(file);
      const newFileName = replaceNameFile(newFile.name);
      const storageRef = ref(storage, `images/${newFileName}`);

      const res = await uploadBytes(storageRef, newFile);
      if (res) {
        return getDownloadURL(storageRef);
      } else {
        throw new Error(`Failed to upload file: ${newFileName}`);
      }
    } catch (error) {
      throw new Error(`Error resizing/uploading file: ${file.name}`);
    }
  });

  try {
    const imagesUrl: string[] = await Promise.all(uploadPromises);
    return imagesUrl;
  } catch (error) {
    message.error("Error uploading one or more files!");
    return null;
  }
};
