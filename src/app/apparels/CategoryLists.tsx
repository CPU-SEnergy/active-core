"use client"

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import React from 'react'
import { SlidersHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import ParamsLink from '@/components/ParamsLink';

export default function CategoryLists() {
  const searchParams = useSearchParams();

  const appendSearchParams = (category: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('c', category);
    return `/apparels?${currentParams.toString()}`;
  };

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger className="focus:outline-none flex gap-1 border border-gray-700 rounded-md py-1 px-3">
            Category <SlidersHorizontal color='black' size={20} className='self-center' />
          </SheetTrigger>
          <SheetContent className='rounded-l-3xl'>
            <SheetHeader>
              <SheetTitle>Categories</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <div className="p-2 flex flex-col items-center text-black">
              <SheetClose asChild>
                <ParamsLink title="T-Shirts" href={appendSearchParams('t-shirt')} />
              </SheetClose>
              <SheetClose asChild>
                <ParamsLink title="Shorts" href={appendSearchParams('shorts')} />
              </SheetClose>
              <SheetClose asChild>
                <ParamsLink title="Headgears" href={appendSearchParams('headgears')} />
              </SheetClose>
              <SheetClose asChild>
                <ParamsLink title="Gloves" href={appendSearchParams('gloves')} />
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop View */}
      <Card className='hidden md:inline-block'>
        <div className="flex flex-col gap-2">
          <ParamsLink title="T-Shirts" href={appendSearchParams('t-shirt')} />
          <ParamsLink title="Shorts" href={appendSearchParams('shorts')} />
          <ParamsLink title="Headgears" href={appendSearchParams('headgears')} />
          <ParamsLink title="Gloves" href={appendSearchParams('gloves')} />
        </div>
      </Card>
    </>
  );
}
