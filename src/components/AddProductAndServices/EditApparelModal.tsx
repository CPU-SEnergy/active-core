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
import { Pencil, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import apparelFormSchema from "@/lib/zod/schemas/apparelFormSchema";
import { editApparel } from "@/app/actions/admin/products-services/editApparel";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import type { APPARELDATA } from "@/lib/types/product-services";
import { mutate } from "swr";

type FormData = z.infer<ReturnType<typeof apparelFormSchema>>;

const APPAREL_TYPES = [
  { value: "gloves", label: "Gloves" },
  { value: "t-shirt", label: "T-Shirt" },
  { value: "pants", label: "Pants" },
  { value: "jersey", label: "Jersey" },
  { value: "shorts", label: "Shorts" },
  { value: "tracksuits", label: "Tracksuits" },
];

export function EditApparel({ data }: { data: APPARELDATA }) {
  const [open, setOpen] = useState(false);
  const [isLoadingApparelData, setIsLoadingApparelData] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(apparelFormSchema(true)),
    defaultValues: {
      name: data.name,
      type: data.type,
      price: data.price,
      description: data.description,
      discount: data.discount ? Number(data.discount) : undefined,
    },
  });

  const selectedFile = watch("image") as File | undefined;
  const preview = selectedFile
    ? URL.createObjectURL(selectedFile)
    : data.imageUrl;

  useEffect(() => {
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, selectedFile]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    setValue("image", file, { shouldValidate: true });
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

  const fetchLatestApparelData = async () => {
    try {
      setIsLoadingApparelData(true);

      const response = await fetch(`/api/apparels/${data.id}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API response error:", response.status, errorText);
        throw new Error(
          `Failed to fetch apparel data: ${response.status} ${response.statusText}`
        );
      }

      const latestData = await response.json();

      if (!latestData) {
        toast.error("Failed to load the latest apparel data.");
        setIsLoadingApparelData(false);
        return;
      }

      reset({
        name: latestData.name,
        type: latestData.type,
        price: latestData.price,
        description: latestData.description,
        discount: latestData.discount ? Number(latestData.discount) : undefined,
      });

      setIsLoadingApparelData(false);
    } catch (error) {
      console.error("Error fetching latest apparel data:", error);
      toast.error("Failed to load the latest apparel data. Please try again.");
      setIsLoadingApparelData(false);
    }
  };

  async function onSubmit(formData: FormData) {
    try {
      const updatedFormData = new FormData();
      updatedFormData.append("id", data.id);
      updatedFormData.append("name", formData.name);
      updatedFormData.append("type", formData.type);
      updatedFormData.append("price", formData.price.toString());
      updatedFormData.append("description", formData.description);

      if (formData.discount) {
        updatedFormData.append("discount", formData.discount.toString());
      }

      updatedFormData.append("existingImageUrl", data.imageUrl);
      if (formData.image instanceof File) {
        updatedFormData.append("image", formData.image);
      }

      const result = await editApparel(updatedFormData);
      if (result.success) {
        setOpen(false);
        toast.success("Apparel updated successfully!");
        mutate("/api/apparels");
      } else {
        toast.error(result.message || "Failed to update apparel.");
        console.log(result);
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (newOpen) {
          fetchLatestApparelData();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="opacity-70 hover:opacity-100"
        >
          <Pencil size={20} />
          <span className="sr-only">Edit apparel</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Apparel</DialogTitle>
          <DialogDescription>
            Update the details of this apparel item.
          </DialogDescription>
        </DialogHeader>

        {isLoadingApparelData ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <p className="text-sm text-gray-500">Loading latest data...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
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

            <div>
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
                      document.getElementById("edit-file-upload")?.click()
                    }
                  >
                    Browse Files
                  </Button>
                  <input
                    id="edit-file-upload"
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
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting || isLoadingApparelData}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-black hover:bg-gray-800"
                disabled={isSubmitting || isLoadingApparelData}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
