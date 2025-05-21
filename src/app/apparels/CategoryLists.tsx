"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import ParamsLink from "@/components/ParamsLink";

export default function CategoryLists() {
  const searchParams = useSearchParams();

  const appendSearchParams = (category: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("c", category);
    return `/apparels?${currentParams.toString()}`;
  };

  // Define categories in a single array to maintain consistency
  const categories = [
    { title: "T-Shirt", value: "t-shirt" },
    { title: "Gloves", value: "gloves" },
    { title: "Pants", value: "pants" },
    { title: "Jersey", value: "jersey" },
    { title: "Shorts", value: "shorts" },
    { title: "Tracksuits", value: "tracksuits" },
  ];

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger className="focus:outline-none flex gap-1 border border-gray-700 rounded-md py-1 px-3">
            Category{" "}
            <SlidersHorizontal
              color="black"
              size={20}
              className="self-center"
            />
          </SheetTrigger>
          <SheetContent className="rounded-l-3xl">
            <SheetHeader>
              <SheetTitle>Categories</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <div className="p-2 flex flex-col items-center text-black">
              {categories.map((category) => (
                <SheetClose key={category.value} asChild>
                  <ParamsLink
                    title={category.title}
                    href={appendSearchParams(category.value)}
                  />
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop View */}
      <Card className="hidden md:block p-5 w-60 space-y-4">
        <span className="font-semibold text-xl">Categories</span>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <ParamsLink
              key={category.value}
              title={category.title}
              href={appendSearchParams(category.value)}
            />
          ))}
        </div>
      </Card>
    </>
  );
}
