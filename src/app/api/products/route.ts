import { NextRequest, NextResponse } from "next/server";
import { app } from "@/lib/firebaseClient";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const db = getFirestore(app);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    // hardcode for now
    const productsCollection = collection(db, "apparels");
    const snapshot = await getDocs(productsCollection);

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Cache");
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
