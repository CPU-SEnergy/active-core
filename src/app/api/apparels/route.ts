import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";
import { ProductType } from "@/lib/types/product";

const db = getFirestore(getFirebaseAdminApp());

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const c = searchParams.get("c");
  const sort = searchParams.get("sort");
  const dir = searchParams.get("dir") as FirebaseFirestore.OrderByDirection;

  try {
    let query: FirebaseFirestore.Query = db.collection(ProductType.APPARELS);

    if (c) {
      query = query.where("type", "==", c);
    }

    if (sort) {
      if (sort === "price") {
        query = query.orderBy(sort, dir);
      } else if (sort === "latest") {
        query = query.orderBy("createdAt", "desc");
      }
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      return NextResponse.json(null);
    }

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products. Please try again later." },
      { status: 500 }
    );
  }
}
