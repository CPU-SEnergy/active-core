import { NextResponse } from "next/server";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { ProductType, productCollectionMap } from "@/lib/types/product";

const db = getFirestore(getFirebaseAdminApp());

export async function POST(req: Request) {
  try {
    const body: Product = await req.json();
    const { name, type, description, picture_link, price, product_type } = body;
    console.log(body);
    if (
      !name ||
      !type ||
      !description ||
      !picture_link ||
      !price ||
      !product_type
    ) {
      return NextResponse.json(
        {
          error:
            "All fields are required: name, type, description, picture_link, price, product_type",
        },
        { status: 400 }
      );
    }

    if (!Object.values(ProductType).includes(product_type as ProductType)) {
      return NextResponse.json(
        {
          error: `Invalid type. Must be one of: ${Object.values(ProductType).join(", ")}`,
        },
        { status: 400 }
      );
    }

    const collectionName = productCollectionMap[product_type as ProductType];
    console.log(collectionName);

    const productRef = db.collection(collectionName).doc();

    const productData = {
      name,
      type,
      description,
      picture_link,
      price,
      product_type,
      createdAt: FieldValue.serverTimestamp(),
    };

    await productRef.set(productData);

    return NextResponse.json({
      success: true,
      message: "Product created successfully.",
      product: { id: productRef.id, ...productData },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        error: "Failed to create product.",
      },
      { status: 500 }
    );
  }
}
