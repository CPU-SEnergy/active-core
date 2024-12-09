import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { storage } from "@/lib/firebaseAdmin";
import os from "os";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("picture_link") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const tempDir = process.env.VERCEL ? "/tmp" : os.tmpdir();
    const tempFilePath = path.join(tempDir, "temp-image.webp");

    await sharp(buffer).webp({ quality: 80 }).toFile(tempFilePath);

    const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
    const destination = `images/${file.name.split(".")[0]}.webp`;
    const uploadedFile = bucket.file(destination);

    await bucket.upload(tempFilePath, {
      destination: uploadedFile,
      public: true,
      metadata: { contentType: "image/webp" },
    });

    await fs.unlink(tempFilePath);

    const fileUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${destination}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
