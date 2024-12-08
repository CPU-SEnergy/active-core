import "server-only";

import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";

const storage = getStorage(getFirebaseAdminApp());

export const getFileFromStorage = async () => {
  const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
  const file = bucket.file("User-Apparels.png");
  const imageUrl = await getDownloadURL(file);
  console.log(imageUrl);
  return imageUrl;
};

export const uploadFileToStorage = async (
  filePath: string,
  destination: string
) => {
  try {
    const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
    const file = bucket.file(destination);

    await bucket.upload(filePath, {
      destination: file,
      metadata: {
        contentType: "image/webp",
      },
    });

    console.log("File uploaded successfully!");
    return file;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
