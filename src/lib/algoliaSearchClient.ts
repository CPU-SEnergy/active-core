import { createMemoryCache } from "@algolia/client-common";
import { liteClient as algoliasearch } from "algoliasearch/lite";

export const responsesCache = createMemoryCache();
export const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
  { responsesCache }
);
