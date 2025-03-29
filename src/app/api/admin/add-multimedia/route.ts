import { NextRequest } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";

type Multimedia = {
  id: string;
  title: string;
  description: string;
  mediaType: "video" | "image";
  isYoutube: boolean;
  url: string;
}

export async function POST(req: NextRequest) {
  try {
    getFirebaseAdminApp();

    const data: Multimedia = await req.json();

    if (!data.title || !data.description || !data.mediaType || !data.url) {
      return new Response(
        JSON.stringify({
          error: "All fields are required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const multimediaRef = db.multimedia.add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { as: "server" });

    return new Response(
      JSON.stringify({
        message: "Media added successfully",
        id: (await multimediaRef).id,
        data: {
          ...data,
        }

      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error adding media: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}