import { PhilippinePesoIcon } from "lucide-react";
import CategoryLists from "./CategoryLists";
import Sort from "./Sort";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import BreadCrumbDisplay from "./BreadCrumbDisplay";

async function fetchProducts() {
  try {
    const res = await fetch("http://localhost:3000/api/products", {
      next: { tags: ["products"] },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ApparelPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { c, sort, dir } = await searchParams;
  console.log(c, sort, dir);

  // Fetch the products
  const products: Product[] = await fetchProducts();
  // console.log(products, "products");

  return (
    <main className="w-full bg-gray-50 h-full">
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
            <BreadCrumbDisplay c={c} />
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
                <span className="self-center text-gray-500">
                  30 items found
                </span>
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
              {/* Display apparels */}
              <div className="grid-cols-2 sm:grid-cols-3 grid gap-5 max-w-full">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-sm shadow-md">
                    <div className="aspect-3/4 rounded-sm ">
                      <Image
                        width={250}
                        height={300}
                        className="object-cover w-full h-full rounded-t-sm "
                        src={product.picture_link}
                        alt={product.name}
                      />
                    </div>
                    <div className="px-4 py-2 flex flex-col gap-1">
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-sm truncate">
                        {product.description}
                      </div>
                      <div className="font-semibold flex gap-1">
                        <PhilippinePesoIcon size={16} className="self-center" />
                        {product.price.toLocaleString("en-PH", {
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
