"use server";

import { algoliasearch } from "algoliasearch";

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY!;
const USERS_INDEX_NAME = "users_index";

if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_API_KEY) {
  throw new Error("Missing Algolia configuration");
}

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);

interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
}

export async function addUserToAlgolia(user: User) {
  try {
    const response = await client.addOrUpdateObject({
      indexName: USERS_INDEX_NAME,
      objectID: user.uuid,
      body: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

    console.log("User added to Algolia:", response);
    return { success: true, response };
  } catch (error) {
    console.error("Error adding user to Algolia:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updatePartialUserToAlgolia(
  uuid: string,
  userData: Partial<Omit<User, "uuid">>
) {
  try {
    const response = await client.partialUpdateObject({
      indexName: USERS_INDEX_NAME,
      objectID: uuid,
      attributesToUpdate: userData,
    });

    console.log("User updated in Algolia:", response);
    return { success: true, response };
  } catch (error) {
    console.error("Error updating user in Algolia:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteUserFromAlgolia(uuid: string) {
  try {
    const response = await client.deleteObject({
      indexName: USERS_INDEX_NAME,
      objectID: uuid,
    });

    console.log("User deleted from Algolia:", response);
    return { success: true, response };
  } catch (error) {
    console.error("Error deleting user from Algolia:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
