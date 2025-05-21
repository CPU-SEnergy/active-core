import { Card } from "@/components/AddProductAndServices/CustomCard"
import { Shirt, Users, Dumbbell, UserCog } from "lucide-react"
import Link from "next/link"

export default function AddProductsPage() {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Add Products and Services</h1>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Link href="/admin/add-products-and-services/apparels" className="block">
            <Card variant="dark" className="p-6 hover:bg-[#2C2C2C] transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <Shirt className="w-12 h-12 text-white" />
                <h2 className="text-xl font-medium text-white">Apparels</h2>
              </div>
            </Card>
          </Link>
  
          <Link href="/admin/add-products-and-services/membership-plans" className="block">
            <Card variant="dark" className="p-6 hover:bg-[#2C2C2C] transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <Users className="w-12 h-12 text-white" />
                <h2 className="text-xl font-medium text-white">Membership Plans</h2>
              </div>
            </Card>
          </Link>
  
          <Link href="/admin/add-products-and-services/classes" className="block">
            <Card variant="dark" className="p-6 hover:bg-[#2C2C2C] transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <Dumbbell className="w-12 h-12 text-white" />
                <h2 className="text-xl font-medium text-white">Classes</h2>
              </div>
            </Card>
          </Link>
  
          <Link href="/admin/add-products-and-services/coaches" className="block">
            <Card variant="dark" className="p-6 hover:bg-[#2C2C2C] transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <UserCog className="w-12 h-12 text-white" />
                <h2 className="text-xl font-medium text-white">Coaches</h2>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    )
  }
  
  