"use client";

import { Loader2, PackageOpen, PhilippinePeso, X } from "lucide-react";
import CategoryLists from "./CategoryLists";
import Sort from "./Sort";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { formatEnumText } from "@/utils/helpers/formatEnumText";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  type: string;
  discount?: number;
  isActive: boolean;
}

function useApparels(
  c: string | string[] | undefined,
  sort: string | string[] | undefined,
  dir: string | string[] | undefined
) {
  const queryParams = new URLSearchParams();

  if (c) {
    const categoryValue = Array.isArray(c) ? c[0] : c;
    if (categoryValue) queryParams.append("c", categoryValue);
  }

  if (sort) {
    const sortValue = Array.isArray(sort) ? sort[0] : sort;
    if (sortValue) queryParams.append("sort", sortValue);
  }

  if (dir) {
    const dirValue = Array.isArray(dir) ? dir[0] : dir;
    if (dirValue) queryParams.append("dir", dirValue);
  }

  const { data, error, isLoading } = useSWR<Product[]>(
    `/api/apparels?${queryParams.toString()}`,
    fetcher,
    {
      dedupingInterval: 60 * 1000,
      revalidateOnFocus: false,
    }
  );

  return { data, error, isLoading };
}

function getCategoryValue(
  c: string | string[] | undefined
): string | undefined {
  if (!c) return undefined;
  return Array.isArray(c) ? c[0] : c;
}

function calculateFinalPrice(price: number, discount?: number): number {
  if (!discount || discount <= 0 || discount >= price) return price;
  return price - discount;
}

export default function ApparelPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const { c, sort, dir } = searchParams;
  const { data: apparels, error, isLoading } = useApparels(c, sort, dir);
  const [isClient, setIsClient] = useState(false);

  const hasFilters = Boolean(c || sort || dir);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const categoryValue = getCategoryValue(c);

  const categoryTitle = formatEnumText(categoryValue);

  const resetFilters = () => {
    router.push("/apparels");
  };

  return (
    <main className="w-full bg-gray-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Mobile Category Title */}
        <div className="md:hidden py-3">
          <h1 className="text-xl font-semibold text-center">{categoryTitle}</h1>
        </div>

        {/* Mobile Filters */}
        <div className="flex justify-between items-center py-3 md:hidden">
          <div className="flex items-center gap-2">
            <CategoryLists />
            {hasFilters && (
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2 border-gray-300 text-gray-700"
                onClick={resetFilters}
              >
                <X size={16} className="mr-1" />
                Reset
              </Button>
            )}
          </div>
          <Sort />
        </div>
        <Separator className="md:hidden mb-4" />

        {/* Breadcrumb - Desktop only */}
        <div className="text-sm text-gray-500 mb-4 hidden md:flex items-center">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <span className="mx-2">{">"}</span>
          <Link href="/apparels" className="hover:text-gray-700">
            Apparel
          </Link>
          {categoryValue && (
            <>
              <span className="mx-2">{">"}</span>
              <span className="text-gray-700">{categoryTitle}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Desktop only */}
          <aside className="hidden md:block w-60 flex-shrink-0">
            <h2 className="text-2xl font-semibold mb-4">Apparels</h2>
            <CategoryLists />
            {hasFilters && (
              <Button
                variant="outline"
                className="mt-4 w-full border-gray-300 text-gray-700"
                onClick={resetFilters}
              >
                <X size={16} className="mr-2" />
                Reset Filters
              </Button>
            )}
          </aside>

          {/* Main Content */}
          <div className="flex-1 w-full">
            {/* Desktop Header with Sort */}
            <div className="justify-between items-center mb-6 hidden md:flex">
              <div className="flex gap-3 items-center">
                <h1 className="text-xl font-semibold">{categoryTitle}</h1>
                {!isLoading && apparels && (
                  <span className="text-sm text-gray-500">
                    {apparels.length} {apparels.length === 1 ? "item" : "items"}{" "}
                    found
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Sort />
              </div>
            </div>

            {/* Active Filters - Desktop */}
            {hasFilters && (
              <div className="mb-4 hidden md:flex items-center">
                <div className="text-sm text-gray-500">Active filters:</div>
                {c && (
                  <div className="ml-2 flex items-center bg-gray-100 text-gray-800 text-xs rounded-full px-3 py-1">
                    {formatEnumText(Array.isArray(c) ? c[0] : c)}
                  </div>
                )}
                {sort && (
                  <div className="ml-2 flex items-center bg-gray-100 text-gray-800 text-xs rounded-full px-3 py-1">
                    {sort === "price"
                      ? `Price ${dir === "asc" ? "Low to High" : "High to Low"}`
                      : formatEnumText(Array.isArray(sort) ? sort[0] : sort)}
                  </div>
                )}
              </div>
            )}

            {/* Banner - Responsive */}
            <div className="mb-6 w-full">
              <div className="relative w-full h-[120px] sm:h-[150px] md:h-[180px] rounded-md overflow-hidden">
                <Image
                  src="https://storage.googleapis.com/senergy-c014a.appspot.com/images/08814e26-faae-4c46-bcc8-741305560429.webp"
                  alt="Apparel collection banner"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-red-700 text-center">
                  Error loading apparels. Please try again later.
                </p>
                <Button
                  variant="outline"
                  className="mx-auto mt-2 block"
                  onClick={() => window.location.reload()}
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Retry
                </Button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className="border rounded-md overflow-hidden bg-white"
                  >
                    <Skeleton className="aspect-[3/4] w-full" />
                    <div className="p-3 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State - Enhanced */}
            {!isLoading && (!apparels || apparels.length === 0) && (
              <div className="text-center py-12 bg-white rounded-md shadow-sm">
                <div className="flex justify-center">
                  <div className="relative w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full">
                    <PackageOpen className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">
                  No products found
                </h3>
                <p className="mt-3 text-base text-gray-500 max-w-md mx-auto">
                  {categoryValue
                    ? `We don't have any ${categoryTitle.toLowerCase()} products available at the moment.`
                    : "We don't have any products available at the moment."}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  {hasFilters && (
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={resetFilters}
                    >
                      <X size={16} className="mr-2" />
                      Reset Filters
                    </Button>
                  )}
                  <Link href="/apparels">
                    <Button
                      variant={hasFilters ? "default" : "outline"}
                      className="w-full sm:w-auto"
                    >
                      View all apparels
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && apparels && apparels.length > 0 && (
              <>
                {/* Mobile Item Count and Active Filters */}
                <div className="md:hidden mb-4">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="text-sm text-gray-500">
                      {apparels.length}{" "}
                      {apparels.length === 1 ? "item" : "items"} found
                    </span>
                    {hasFilters && (
                      <div className="flex flex-wrap justify-center gap-1">
                        {c && (
                          <div className="flex items-center bg-gray-100 text-gray-800 text-xs rounded-full px-2 py-1">
                            {formatEnumText(Array.isArray(c) ? c[0] : c)}
                          </div>
                        )}
                        {sort && (
                          <div className="flex items-center bg-gray-100 text-gray-800 text-xs rounded-full px-2 py-1">
                            {sort === "price"
                              ? `Price ${dir === "asc" ? "Low to High" : "High to Low"}`
                              : formatEnumText(
                                  Array.isArray(sort) ? sort[0] : sort
                                )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                  {apparels.map((apparel) => {
                    const hasDiscount =
                      apparel.discount &&
                      apparel.discount > 0 &&
                      apparel.discount < apparel.price;
                    const finalPrice = calculateFinalPrice(
                      apparel.price,
                      apparel.discount
                    );

                    return (
                      <Link
                        href={`/apparels/${apparel.id}`}
                        key={apparel.id}
                        className="group border rounded-md overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="aspect-[3/4] relative overflow-hidden">
                          <Image
                            src={apparel.imageUrl || "/placeholder.svg"}
                            alt={apparel.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {hasDiscount && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              - ₱{apparel.discount!.toLocaleString("en-PH")}
                            </div>
                          )}
                        </div>
                        <div className="p-3 sm:p-4">
                          <h3
                            className="font-medium text-sm sm:text-base line-clamp-1"
                            title={apparel.name}
                          >
                            {apparel.name}
                          </h3>
                          <p
                            className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2 min-h-[2.5rem]"
                            title={apparel.description}
                          >
                            {apparel.description || "No description available"}
                          </p>
                          <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
                            <div className="flex items-center font-semibold text-sm sm:text-base">
                              <PhilippinePeso
                                size={16}
                                className="mr-1 flex-shrink-0"
                              />
                              {finalPrice.toLocaleString("en-PH", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                            {hasDiscount && (
                              <span className="text-xs text-gray-500 line-through">
                                ₱
                                {apparel.price.toLocaleString("en-PH", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </main>
  );
}
