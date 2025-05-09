import { Card } from "@/components/AddProductAndServices/CustomCard"
import { Megaphone, Medal,} from "lucide-react"
import Link from "next/link"

export default function AddProductsPage() {
    return (
      <div className="p-20 space-y-6">
        <h1 className="text-2xl font-semibold">Homepage Editor</h1>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Link href="/admin/homepage-editor/advertising-video" className="block">
            <Card variant="dark" className="p-6 hover:bg-[#2C2C2C] transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <Megaphone className="w-12 h-12 text-white" />
                <h2 className="text-xl font-medium text-white">Advertising Video</h2>
              </div>
            </Card>
          </Link>
  
          <Link href="/admin/homepage-editor/fighters" className="block">
            <Card variant="dark" className="p-6 hover:bg-[#2C2C2C] transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <Medal className="w-12 h-12 text-white" />
                <h2 className="text-xl font-medium text-white">Fighters</h2>
              </div>
            </Card>
          </Link>

        </div>
      </div>
    )
  }
  
  