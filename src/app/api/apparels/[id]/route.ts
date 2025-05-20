import { NextResponse } from "next/server";
import { db, Schema } from "@/lib/schema/firestore";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id as Schema["apparels"]["Ref"]["id"];

    if (!id) {
      return NextResponse.json(
        { error: "Apparel ID is required" },
        { status: 400 }
      );
    }

    console.log("Fetching apparel with ID:", id);

    getFirebaseAdminApp();

    const apparel = await db.apparels.get(id);

    if (!apparel) {
      console.log("Apparel not found with ID:", id);
      return NextResponse.json({ error: "Apparel not found" }, { status: 404 });
    }

    const apparelData = {
      id: apparel.ref.id,
      name: apparel.data.name,
      price: apparel.data.price,
      discount: apparel.data.discount,
      description: apparel.data.description,
      imageUrl: apparel.data.imageUrl,
      isActive: apparel.data.isActive,
      type: apparel.data.type,
    };

    return NextResponse.json(apparelData);
  } catch (error: unknown) {
    console.error("Error fetching apparel:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to fetch apparel data", details: message },
      { status: 500 }
    );
  }
}
