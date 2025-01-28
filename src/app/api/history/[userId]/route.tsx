// import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
// import { db, Schema } from "@/lib/schema/firestore";
// import { NextResponse } from "next/server";

// export async function GET(
//   request: Request,
//   { params }: { params: { membershipHistoryId: string } }
// ): Promise<NextResponse> {
//   try {
//     getFirebaseAdminApp();
//     console.log(params);

//     if (!params?.membershipHistoryId) {
//       return NextResponse.json(
//         { error: "User ID is required" },
//         { status: 400 }
//       );
//     }

//     const id = db.membershipHistory.id(params.membershipHistoryId);

//     const membershipHistoryDoc = await db.users.get(id, {
//       as: "server",
//     });

//     if (!membershipHistoryDoc) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const membershipHistory: Schema["membershipHistory"]["Data"] =
//       membershipHistoryDoc.data;

//     if (!membershipHistory) {
//       return NextResponse.json(
//         { error: "No Membership History not found" },
//         { status: 404 }
//       );
//     }

//     const userData = {
//       ...membershipHistory,
//     };

//     return NextResponse.json(userData);
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch user" },
//       { status: 500 }
//     );
//   }
// }
