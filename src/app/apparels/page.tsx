import React from 'react'
import CategoryLists from './CategoryLists'
import Sort from './Sort'
import { Separator } from "@/components/ui/separator"

export default async function ApparelPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { q, sort, dir } = await searchParams

  console.log(q, sort, dir)

  return (
    <main className='w-screen bg-gray-50 h-screen'>
      <div className='max-w-7xl mx-auto w-full flex md:flex-row flex-col'>
        <div className='flex justify-between mx-4 my-2'>
          {/* filter */}
          <CategoryLists />
          {/* sort */}
          <Sort />
        </div>
        <Separator />
        <div>asdsad</div>
        {/* display apparels */}
        <div></div>
      </div>
    </main>
  )
}