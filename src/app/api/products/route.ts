import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebaseAdmin";

import { Query, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { ApparelType, ProductType } from "@/lib/types/product";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const c = searchParams.get("c");
    const sort = searchParams.get("sort");
    const dir = searchParams.get("dir");

    console.log("c", c, "sort", sort, "dir", dir);

    const apparelsCollection = firestore.collection(ProductType.APPARELS);
    let firebaseQuery: Query = apparelsCollection;

    if (c) {
      firebaseQuery = firebaseQuery.where("type", "==", c as ApparelType);
    }

    if (sort) {
      if (sort === "price" && dir) {
        firebaseQuery = firebaseQuery.orderBy(
          "price",
          dir === "asc" ? "asc" : "desc"
        );
      } else if (sort === "popularity") {
        console.log("popularity");
        firebaseQuery = firebaseQuery.orderBy("popularity", "desc");
      } else if (sort === "latest") {
        console.log("latest");
        firebaseQuery = firebaseQuery.orderBy("createdAt", "desc");
      }
    }

    const snapshot = await firebaseQuery.get();
    const data = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching apparels:", error);
    return NextResponse.json(
      { error: "Failed to fetch apparels" },
      { status: 500 }
    );
  }
}
