/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash, Upload, Pencil } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { editCoach } from "@/app/actions/admin/editCoach";

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
import { mutate } from "swr";
import coachFormSchema from "@/lib/zod/schemas/coachFormSchema";
import { COACHDATA } from "@/lib/types/product-services";

type FormData = z.infer<typeof coachFormSchema>;

export function EditCoach({ data }: { data: COACHDATA }) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(coachFormSchema),
    defaultValues: {
      name: data.name,
      specialization: data.specialization,
      contactInfo: data.contactInfo,
      dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
      experience: data.experience,
      certifications: data.certifications || [""],
      bio: data.bio,
      image: data.imageUrl,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  const selectedFile = watch("image");

  const preview =
    selectedFile instanceof File
      ? URL.createObjectURL(selectedFile)
      : data.imageUrl;

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    setValue("image", file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  async function onSubmit(formData: FormData) {
    const updatedFormData = new FormData();
    updatedFormData.append("id", data.id);
    updatedFormData.append("name", formData.name);
    updatedFormData.append("specialization", formData.specialization);
    updatedFormData.append("contactInfo", formData.contactInfo);
    updatedFormData.append("dob", formData.dob ? formData.dob.toString() : "");
    updatedFormData.append("experience", formData.experience.toString());
    updatedFormData.append("bio", formData.bio);

    formData.certifications.forEach((cert) =>
      updatedFormData.append("certifications", cert)
    );

    updatedFormData.append("existingImageUrl", data.imageUrl);
    if (formData.image instanceof File) {
      updatedFormData.append("image", formData.image);
    }

    try {
      const result = await editCoach(updatedFormData);
      if (result.status === 200) {
        toast.success(result.message || "Coach updated successfully!");

        reset();
        await mutate("/api/coaches");
      } else {
        toast.error(result.message || "Error updating coach.");
      }
    } catch (error) {
      console.error("Error updating coach:", error);
      toast.error("Error updating coach. Please try again.");
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Coach</DialogTitle>
          <DialogDescription>
            Update the details of this coach.
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
            <Label htmlFor="specialization">Specialization</Label>
            <Input id="specialization" {...register("specialization")} />
            {errors.specialization && (
              <p className="text-sm text-red-500">
                {errors.specialization.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" type="date" {...register("dob")} />
            {errors.dob && (
              <p className="text-sm text-red-500">{errors.dob.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="contactInfo">Contact Info</Label>
            <Input id="contactInfo" {...register("contactInfo")} />
            {errors.contactInfo && (
              <p className="text-sm text-red-500">
                {errors.contactInfo.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="experience">Experience</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              {...register("experience")}
            />
            {errors.experience && (
              <p className="text-sm text-red-500">
                {errors.experience.message}
              </p>
            )}
          </div>

          <div>
            <Label>Certifications</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input {...register(`certifications.${index}` as const)} />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append("")}>
              + Add Certification
            </Button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Enter coach bio"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-sm text-red-500">{errors.bio.message}</p>
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
              <p className="text-sm text-red-500">
                {errors.image?.message?.toString()}
              </p>
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
