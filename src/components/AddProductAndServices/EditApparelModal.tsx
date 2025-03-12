"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import apparelFormSchema from "@/lib/zod/schemas/apparels";
import { editApparel } from "../../../actions/admin/editApparel";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(data.imageUrl || null);
  const [dragActive, setDragActive] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
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
      toast.error("Please upload an image file");
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setValue("image", file as any);
  };

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

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

    if (selectedFile) {
      updatedFormData.append("image", selectedFile);
    }

    try {
      const result = await editApparel(updatedFormData);
      if (result.success) {
        setSuccess(true);
        toast.success("Apparel updated successfully!");
        mutate("/api/apparels");
        setOpen(false);
      } else {
        setError(result.error || "Failed to update apparel.");
        toast.error(result.error || "Failed to update apparel.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md overflow-y-auto">
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

          <div>
            <Label htmlFor="type">Type</Label>
            <Input id="type" {...register("type")} />
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              min="0.00"
              step={0.01}
              {...register("price")}
            />
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
              step={0.01}
              {...register("discount")}
            />
            {errors.discount && (
              <p className="text-sm text-red-500">{errors.discount.message}</p>
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
              <p className="text-sm text-red-500">{errors.image?.message}</p>
            )}
            {preview ? (
              <div className="flex justify-center mt-2">
                <Image
                  width={96}
                  height={96}
                  src={preview || "/default-placeholder.png"}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-md"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center">
                No image selected
              </p>
            )}
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {success && (
            <p className="text-green-500">Apparel updated successfully!</p>
          )}

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button className="w-full" type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
