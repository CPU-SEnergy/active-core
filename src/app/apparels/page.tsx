import CategoryLists from './CategoryLists'
import Sort from './Sort'
import { Separator } from "@/components/ui/separator"
import { getProducts } from '@/utils/firebase/fetchData'
import Image from 'next/image'

export default async function ApparelPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { c, sort, dir } = await searchParams;
  console.log(c, sort, dir);

  // const products: Product[] = await getProducts()

  const res = fetch("http://localhost:3000/api/products", { next: { tags: ['products'] } })

  const products = await (await res).json()
  console.log(products, "products")
  return (
    <main className="w-screen bg-gray-50 h-screen">
      <div className="max-w-7xl mx-auto w-full flex md:flex-row flex-col">
        <div className="flex justify-between mx-4 my-2">
          {/* filter */}
          <CategoryLists />
          {/* sort */}
          <Sort />
        </div>
        <Separator />
        <div>asdsad</div>
        {/* display apparels */}
        <div>
          {/* {products.map((product) => (
            <div key={product.id} className="flex flex-col m-4">
              <Image
                src={product.picture_link}
                alt={product.name}
                width={200}
                height={200}
              />
              <div>{product.name}</div>
              <div>{product.price}</div>
            </div>
          ))} */}
        </div>
      </div>
    </main>
  );
}