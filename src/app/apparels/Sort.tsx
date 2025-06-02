"use client"

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ArrowDownUp } from 'lucide-react';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useSearchParams, useRouter } from 'next/navigation';

export default function Sort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (sortValue: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const [sortField, dir] = sortValue.split('&dir=');
    if (sortField) {
      currentParams.set('sort', sortField);
    }
    if (sortField === 'price' && dir) {
      currentParams.set('dir', dir);
    } else {
      currentParams.delete('dir');
    }

    router.push(`?${currentParams.toString()}`);
  };

  const currentSort = searchParams.get('sort') || 'latest';
  const currentDir = searchParams.get('dir');

  return (
    <div>
      <Sheet>
        <SheetTrigger className="focus:outline-none flex gap-1 border border-gray-700 rounded-md py-1 px-3">
          Sort by <ArrowDownUp color='black' size={20} className='self-center' />
        </SheetTrigger>
        <SheetContent className='rounded-l-3xl'>
          <SheetHeader>
            <SheetTitle>Sort by</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="p-2 flex flex-col items-center text-black">
            <SheetClose asChild>
              <RadioGroup value={currentSort === 'price' ? `${currentSort}&dir=${currentDir}` : currentSort}
                onValueChange={(value) => handleSortChange(value)}
                className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="latest" id="latest" />
                  <Label className='cursor-pointer' htmlFor="latest">Latest</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price&dir=desc" id="price-high-to-low" />
                  <Label className='cursor-pointer' htmlFor="price-high-to-low">Price High to Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price&dir=asc" id="price-low-to-high" />
                  <Label className='cursor-pointer' htmlFor="price-low-to-high">Price Low to High</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="discount" id="discount" />
                  <Label className='cursor-pointer' htmlFor="discount">Discount</Label>
                </div>
              </RadioGroup>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
