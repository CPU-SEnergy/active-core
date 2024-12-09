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
import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import ParamsLink from "@/components/ParamsLink";
import { ApparelType } from "@/lib/types/product";

export default function CategoryLists() {
  const searchParams = useSearchParams();

  const appendSearchParams = (category: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("c", category);
    return `/apparels?${currentParams.toString()}`;
  };

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
              <SheetClose asChild>
                <ParamsLink
                  title="T-Shirts"
                  href={appendSearchParams(ApparelType.T_SHIRT)}
                />
              </SheetClose>
              <SheetClose asChild>
                <ParamsLink
                  title="Shorts"
                  href={appendSearchParams(ApparelType.SHORT)}
                />
              </SheetClose>
              <SheetClose asChild>
                <ParamsLink
                  title="Headgears"
                  href={appendSearchParams(ApparelType.HEADGEAR)}
                />
              </SheetClose>
              <SheetClose asChild>
                <ParamsLink
                  title="Gloves"
                  href={appendSearchParams(ApparelType.GLOVE)}
                />
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop View */}
      <Card className="hidden md:block p-5 w-60 space-y-4">
        <span className="font-semibold text-xl">Categories</span>
        <div className="flex flex-col gap-2">
          <ParamsLink
            title="T-Shirts"
            href={appendSearchParams(ApparelType.T_SHIRT)}
          />
          <ParamsLink
            title="Shorts"
            href={appendSearchParams(ApparelType.SHORT)}
          />
          <ParamsLink
            title="Headgears"
            href={appendSearchParams(ApparelType.HEADGEAR)}
          />
          <ParamsLink
            title="Gloves"
            href={appendSearchParams(ApparelType.GLOVE)}
          />
        </div>
      </Card>
    </>
  );
}
