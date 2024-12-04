import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { ProductType, productCollectionMap } from "@/lib/types/product";

const db = getFirestore(getFirebaseAdminApp());

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, type, description, file } = body;

    if (!name || !price || !type || !description || !file) {
      return NextResponse.json(
        {
          error: "All fields are required",
        },
        { status: 400 }
      );
    }

    console.log("Received type:", type);
    if (!Object.values(ProductType).includes(type as ProductType)) {
      return NextResponse.json(
        {
          error: "Invalid product type",
        },
        { status: 400 }
      );
    }

    const subCollection = productCollectionMap[type as ProductType];
    console.log("Subcollection mapped:", subCollection);

    if (!subCollection) {
      return NextResponse.json(
        {
          error: "Invalid product subcollection",
        },
        { status: 400 }
      );
    }

    const productRef = db
      .collection("products")
      .doc(type)
      .collection(subCollection)
      .doc();

    const productData = {
      name,
      price,
      type,
      description,
      imageUrl: file,
      createdAt: new Date(),
    };

    await productRef.set(productData);

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      product: productData,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        error: "Failed to create product",
      },
      { status: 500 }
    );
  }
}
