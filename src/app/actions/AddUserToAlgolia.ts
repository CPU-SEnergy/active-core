"use server";

import { algoliasearch } from "algoliasearch";

interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
}

export async function addUserToAlgolia({
  uuid,
  firstName,
  lastName,
  email,
}: User) {
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    process.env.ALGOLIA_ADMIN_API_KEY!
  );

  const response = await client.addOrUpdateObject({
    indexName: "users_index",
    objectID: uuid,
    body: {
      firstName: firstName,
      lastName: lastName,
      email: email,
    },
  });

  console.log("Algolia response:", response);

  return response;
}
