import "server-only";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";

export async function getProducts() {
  const db = getFirestore(getFirebaseAdminApp());
  try {
    const productsCollection = db.collection("apparels");
    const snapshot = await productsCollection.get();

    const products: Product[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        price: data.price,
        product_type: data.product_type,
        type: data.type,
        description: data.description,
        picture_link: data.picture_link,
        special_price: data.special_price ?? undefined,
        createdAt: data.createdAt?.toDate() ?? undefined,
      };
    });

    return products;
  } catch (error) {
    console.error("Failed to fetch products from Firestore:", error);
    throw new Error("Unable to fetch products. Please try again later.");
  }
}
