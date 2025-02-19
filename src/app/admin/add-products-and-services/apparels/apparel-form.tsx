"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { Upload } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(1, "Description is required"),
  image: z.any().optional(),
})

type FormData = z.infer<typeof formSchema>

interface ApparelFormProps {
  onSuccess: () => void
}

export function ApparelForm({ onSuccess }: ApparelFormProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Form data:", data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Apparel created successfully!")
      onSuccess()
    } catch (error) {
      console.error("Error creating apparel:", error)
      toast.error("Error creating apparel. Please try again.")
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Please upload an image file")
    setValue("image", file)
    setPreview(URL.createObjectURL(file))
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Enter item name" className="bg-gray-50" {...register("name")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="price">Price</Label>
        <Input id="price" placeholder="Enter item price" className="bg-gray-50" {...register("price")} />
        {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Enter item description" className="bg-gray-50 min-h-[100px]" {...register("description")} />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label>Upload files</Label>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${dragActive ? "border-black bg-gray-50" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-gray-400" />
            <p className="text-lg">Drop files here</p>
            <p className="text-sm text-gray-500">Supported format: PNG, JPG</p>
            <p className="text-sm text-gray-500">OR</p>
            <Button type="button" variant="outline" className="mt-2" onClick={() => document.getElementById("file-upload")?.click()}>
              Browse files
            </Button>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
        </div>
        {preview && <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-md mt-2" />}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit" className="bg-black hover:bg-gray-800" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  )
}

