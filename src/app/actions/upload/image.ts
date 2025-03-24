"use server";

import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { getStorage } from "firebase-admin/storage";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import os from "os";

const storage = getStorage(getFirebaseAdminApp());

export async function uploadImage(image: File, dir: string) {
  try {
    const file = image;

    if (!file) {
      return { error: "No file provided", status: 400 };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const tempDir = process.env.VERCEL ? "/tmp" : os.tmpdir();
    const tempFilePath = path.join(tempDir, "temp-image.webp");

    await sharp(buffer).webp({ quality: 100 }).toFile(tempFilePath);

    const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
    const destination = `images/${dir}/${file.name.split(".")[0]}.webp`;
    const uploadedFile = bucket.file(destination);

    await bucket.upload(tempFilePath, {
      destination: uploadedFile,
      public: true,
      metadata: { contentType: "image/webp" },
    });

    await fs.unlink(tempFilePath);

    const fileUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${destination}`;

    return { success: true, url: fileUrl };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { error: "File upload failed", status: 500 };
  }
}
