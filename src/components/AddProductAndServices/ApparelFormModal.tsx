"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import apparelFormSchema from "@/lib/zod/schemas/apparelFormSchema";
import { mutate } from "swr";
import { createApparel } from "@/app/actions/admin/products-services/createApparel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type FormData = z.infer<ReturnType<typeof apparelFormSchema>>;

const APPAREL_TYPES = [
  { value: "gloves", label: "Gloves" },
  { value: "t-shirt", label: "T-Shirt" },
  { value: "pants", label: "Pants" },
  { value: "jersey", label: "Jersey" },
  { value: "shorts", label: "Shorts" },
  { value: "tracksuits", label: "Tracksuits" },
];

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
    defaultValues: {
      name: "",
      type: "",
      price: 0,
      description: "",
      discount: undefined,
    },
  });

  // Cleanup URL object when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      formData.append("price", data.price.toString());
      formData.append("description", data.description);

      if (data.discount !== undefined) {
        formData.append("discount", data.discount.toString());
      }

      if (data.image) {
        formData.append("image", data.image);
      }

      const result = await createApparel(formData);
      if (result.status === 201) {
        setOpen(false); 
        mutate("/api/apparels");
        toast.success("Apparel created successfully!");
        reset();
        setPreview(null);
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to create apparel.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
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
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }
    setValue("image", file, { shouldValidate: true });
    setPreview(URL.createObjectURL(file));
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);

    // Only reset the form when closing the dialog
    if (!newOpen && !isSubmitting) {
      // Small delay to avoid visual glitches
      setTimeout(() => {
        reset();
        setPreview(null);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="mb-8 py-6 text-base border-2 border-gray-200 bg-white text-black hover:bg-gray-100"
          variant="outline"
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-2 h-5 w-5" />
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
              {APPAREL_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
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
                placeholder="Enter price"
                className="bg-gray-50"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discount">Discount (Optional)</Label>
              <Input
                id="discount"
                type="number"
                min="0.00"
                step="0.01"
                placeholder="Enter discount"
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
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
                dragActive ? "border-black bg-gray-50" : ""
              }`}
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
                    document.getElementById("add-file-upload")?.click()
                  }
                >
                  Browse Files
                </Button>
                <input
                  id="add-file-upload"
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg"
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
                <div className="relative w-24 h-24">
                  <Image
                    fill
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    className="object-cover rounded-md"
                    sizes="96px"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-black hover:bg-gray-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
