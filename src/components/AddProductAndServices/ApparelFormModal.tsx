"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import apparelFormSchema from "@/lib/zod/schemas/apparelFormSchema";
import { mutate } from "swr";
import { createApparel } from "@/app/actions/admin/products-services/createApparel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";

type FormData = z.infer<ReturnType<typeof apparelFormSchema>>;

export function ApparelForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(apparelFormSchema(false)),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      formData.append("price", data.price.toString());
      formData.append("discount", data.discount?.toString() || "");
      formData.append("description", data.description);
      if (data.image) {
        formData.append("image", data.image);
      }

      const result = await createApparel(formData);
      if (result.status === 201) {
        toast.success("Apparel updated successfully!");
        mutate("/api/apparels");
        setOpen(false);
      } else {
        toast.error(result.message || "Failed to update apparel.");
        console.log(result);
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      reset();
      setPreview(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/"))
      return toast.error("Please upload an image file");
    setValue("image", file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="mb-8 py-6 text-base border-2 border-gray-200 bg-white text-black hover:bg-gray-100"
          variant={"outline"}
        >
          Add Apparel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Apparel</DialogTitle>
          <DialogDescription>
            Fill in the details for creating new apparels.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter item name"
              className="bg-gray-50"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type of Apparel</Label>
            <select
              id="type"
              {...register("type")}
              className="bg-gray-50 border rounded-md px-3 py-2"
            >
              <option value="">Select apparel type</option>
              <option value="gloves">Gloves</option>
              <option value="t-shirt">T-Shirt</option>
              <option value="pants">Pants</option>
              <option value="jersey">Jersey</option>
              <option value="shorts">Shorts</option>
              <option value="tracksuits">Tracksuits</option>
            </select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min="0.00"
                step="0.01"
                placeholder="Enter item price"
                className="bg-gray-50"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="discount">Discount (Optional)</Label>
              <Input
                id="discount"
                type="number"
                min="0.00"
                step="0.01"
                placeholder="Enter discount price"
                className="bg-gray-50"
                {...register("discount")}
              />
              {errors.discount && (
                <p className="text-sm text-red-500">
                  {errors.discount.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter item description"
              className="bg-gray-50 min-h-[80px]"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Upload Image</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${dragActive ? "border-black bg-gray-50" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Drop files here or click to browse
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  Browse Files
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".png,.jpg,.jpeg"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFile(e.target.files[0])
                  }
                />
              </div>
            </div>
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image.message}</p>
            )}
            {preview && (
              <div className="flex justify-center mt-2">
                <Image
                  width={96}
                  height={96}
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-md"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="w-full">
                  Close
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-black hover:bg-gray-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
