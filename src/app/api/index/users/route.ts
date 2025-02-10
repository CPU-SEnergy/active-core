import { Schema } from "@/lib/schema/firestore";
import { searchClient } from "@algolia/client-search";
import { NextResponse } from "next/server";

const client = searchClient(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_ADMIN_API_KEY as string
);

export async function GET() {
  try {
    const usersResponse = await fetch("http://localhost:3000/api/user");
    const users = await usersResponse.json();

    const usersObject = users.map((user: Schema["users"]["Data"]) => {
      return {
        objectID: user.uid,
        ...user,
      };
    });

    console.log("Indexing objects:", users);
    await client.saveObjects({
      indexName: "users_index",
      objects: usersObject,
    });

    return NextResponse.json({ message: "Successfully indexed objects!" });
  } catch (error: unknown) {
    console.error("Error indexing objects:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
