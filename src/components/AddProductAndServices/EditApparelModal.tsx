/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Upload } from "lucide-react";
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
import { APPARELDATA } from "@/lib/types/product-services";
import { mutate } from "swr";

type FormData = z.infer<ReturnType<typeof apparelFormSchema>>;

export function EditApparel({ data }: { data: APPARELDATA }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    setValue("image", file, { shouldValidate: true });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  async function onSubmit(formData: FormData) {
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

    try {
      const result = await editApparel(updatedFormData);
      if (result.success) {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Pencil size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Apparel</DialogTitle>
          <DialogDescription>
            Update the details of this apparel.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
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
              <option value="">Edit apparel type</option>
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

          <div>
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" min="0.00" {...register("price")} />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="discount">Discount</Label>
            <Input
              id="discount"
              type="number"
              min="0.00"
              {...register("discount")}
            />
            {errors.discount && (
              <p className="text-sm text-red-500">{errors.discount.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Upload Image</Label>
            <div
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
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
              <p className="text-sm text-red-500">{errors.image?.message}</p>
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

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="w-full">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
