"use client";

import { PhilippinePesoIcon } from "lucide-react";
import CategoryLists from "./CategoryLists";
import Sort from "./Sort";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { formatEnumText } from "@/utils/helpers/formatEnumText";

function FetchApparels(
  c: string | string[] | undefined,
  sort: string | string[] | undefined,
  dir: string | string[] | undefined
) {
  const queryParams = new URLSearchParams();

  if (c) queryParams.append("c", Array.isArray(c) ? c.join(",") : c);
  if (sort)
    queryParams.append("sort", Array.isArray(sort) ? sort.join(",") : sort);
  if (dir) queryParams.append("dir", Array.isArray(dir) ? dir.join(",") : dir);

  const { data, error, isLoading } = useSWR<Product[]>(
    `/api/apparels?${queryParams.toString()}`,
    fetcher
  );

  return { data, error, isLoading };
}

export default function ApparelPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { c, sort, dir } = searchParams;

  const { data: apparels, error, isLoading } = FetchApparels(c, sort, dir);

  if (error) {
    console.error(error);
    return <p>Error loading apparels. Please try again later.</p>;
  }
  console.log(apparels);
  return (
    <main className="w-full bg-gray-50 h-screen">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:px-5 pb-10">
        <div className="flex justify-between mx-4 my-2 md:hidden">
          {/* filter */}
          <CategoryLists />
          <Sort />
          {/* sort */}
        </div>
        <Separator className="md:hidden" />
        {/* Desktop */}
        <div className="md:block hidden h-16">
          <div className="flex items-center w-full h-full">
            Home {">"} Apparel {c && `> ${formatEnumText(c as string)}`}
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="md:block hidden">
            <div className="h-14 text-3xl font-semibold text-center">
              <span className="flex items-center w-full h-full pl-5">
                Shirt
              </span>
            </div>
            <CategoryLists />
          </div>
          <div className="max-w-[1000px]">
            <div className="justify-between h-14 items-center md:flex hidden">
              <div className="flex gap-6 items-center">
                <span className="text-xl font-semibold">All Products</span>
                {apparels && (
                  <span className="self-center text-gray-500">
                    {apparels.length} items found
                  </span>
                )}
              </div>
              <Sort />
            </div>

            <div className="space-y-4">
              {/* banner */}
              {/* Hardcoded for now */}
              <Image
                src="https://storage.googleapis.com/senergy-c014a.appspot.com/images/08814e26-faae-4c46-bcc8-741305560429.webp"
                alt="banner"
                width={1000}
                height={200}
                className="object-cover max-w-full max-h-[200px] hidden lg:block rounded-sm"
              />
              {apparels && apparels.length === 0 && (
                <div className="w-full text-center text-xl text-gray-500">
                  Oops... It looks like we don&apos;t have it yet.
                </div>
              )}
              {/* Display apparels */}
              <div className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 grid gap-5 max-w-full">
                {isLoading && <p>Loading apparels...</p>}
                {apparels &&
                  apparels.map((apparel) => (
                    <div
                      key={apparel.id}
                      className="border rounded-sm shadow-md"
                    >
                      <div className="aspect-3/4 rounded-sm ">
                        <Image
                          width={250}
                          height={300}
                          className="object-cover w-full h-full rounded-t-sm "
                          src={apparel.picture_link}
                          alt={apparel.name}
                        />
                      </div>
                      <div className="px-4 py-2 flex flex-col gap-1">
                        <div className="font-semibold">{apparel.name}</div>
                        <div className="text-sm truncate">
                          {apparel.description}
                        </div>
                        <div className="font-semibold flex gap-1">
                          <PhilippinePesoIcon
                            size={16}
                            className="self-center"
                          />
                          {apparel.price.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
