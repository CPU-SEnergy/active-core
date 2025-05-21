import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/schema/firestore";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const c = searchParams.get("c");
  const sort = searchParams.get("sort");
  const dir = searchParams.get("dir") as FirebaseFirestore.OrderByDirection;

  try {
    getFirebaseAdminApp();
    const $ = db.apparels.query.build();

    if (c) {
      $.field("type").eq(c);
    }

    if (sort) {
      if (sort === "price") {
        $.field(sort).order(dir);
      } else if (sort === "latest") {
        $.field("createdAt").order(dir);
      }
    }
    const results = await $.run();

    if (results.length === 0) {
      return NextResponse.json(null);
    }

    console.log("resultsssssssssssss", results);
    const data = results.map((result) => {
      return {
        id: result.ref.id,
        name: result.data.name,
        price: result.data.price,
        discount: result.data.discount,
        description: result.data.description,
        imageUrl: result.data.imageUrl,
        isActive: result.data.isActive,
        type: result.data.type,
      };
    });

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
