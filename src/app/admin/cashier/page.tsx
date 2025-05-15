"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface Cashier {
  id: string
  uid: string
  name: string
  avatar?: string
  createdAt: string
}

export default function CashierManagement() {
  const [cashiers, setCashiers] = useState<Cashier[]>([])
  const [loading, setLoading] = useState(false)
  const [targetUid, setTargetUid] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddCashier = async () => {
    if (!targetUid) {
      toast.error("Please enter a user UID")
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/add-cashier/cashier-tagging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUid }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add cashier')
      }

      await response.json()
      
      // Add the new cashier to the list
      setCashiers(prev => [...prev, {
        id: targetUid,
        uid: targetUid,
        name: targetUid, // You might want to fetch the actual user name from Firebase
        createdAt: new Date().toISOString()
      }])

      toast.success("Cashier added successfully")
      setIsDialogOpen(false)
      setTargetUid("")
    } catch (error) {
      console.error('Error adding cashier:', error)
      toast.error(error instanceof Error ? error.message : "Failed to add cashier")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cashier Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800 text-white">
              Add Cashier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Cashier</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="uid">User UID</Label>
                <Input
                  id="uid"
                  value={targetUid}
                  onChange={(e) => setTargetUid(e.target.value)}
                  placeholder="Enter user UID"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="ghost" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-black text-white"
                onClick={handleAddCashier}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={5} className="bg-white py-4">
                <h2 className="text-xl font-bold px-2 text-black">Current Cashiers</h2>
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="w-[300px]">Cashier UID</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cashiers.map((cashier) => (
              <TableRow key={cashier.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={cashier.avatar} alt={cashier.uid} />
                      <AvatarFallback>{cashier.uid.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{cashier.uid}</span>
                  </div>
                </TableCell>
                <TableCell>{new Date(cashier.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => toast.error("Remove functionality not implemented yet")}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}