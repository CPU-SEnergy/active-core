"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ExpiredLinkPageClient() {
  const router = useRouter()
  const handleSignupRedirect = () => {
    router.push("/auth/register");
  };

  return (
    <Button
      className="w-full font-semibold py-3 rounded-md shadow-md bg-green-500 hover:bg-green-600 text-white transition-all"
      onClick={handleSignupRedirect}
    >
      Get Started Again
    </Button>
  );
}