import { responsesCache } from "@/lib/client";
import Search from "./search";
export const dynamic = "force-dynamic";

export default function Page() {
  responsesCache.clear();
  return <Search />;
}
