/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import type React from "react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash, Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { editClass } from "@/app/actions/admin/products-services/editClass";
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
import useSWR, { mutate } from "swr";
import fetcher from "@/lib/fetcher";
import { classFormSchema } from "@/lib/zod/schemas/classFormSchema";
import type { CLASSDATA, COACHDATA } from "@/lib/types/product-services";
import type { z } from "zod";

type FormData = z.infer<typeof classFormSchema> & {
  id: string;
  existingImageUrl: string;
};

interface EditClassModalProps {
  data: CLASSDATA;
}

export default function EditClassModal({ data }: EditClassModalProps) {
  const [open, setOpen] = useState(false);

  const {
    data: coaches,
    error: coachesError,
    isLoading: coachesLoading,
  } = useSWR<COACHDATA[]>("/api/coaches", fetcher, {
    dedupingInterval: 60 * 60 * 24,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      id: data.id,
      name: data.name,
      schedule: data.schedule,
      description: data.description,
      // Fix: Check if coachId exists and is an array before mapping
      coaches: Array.isArray(data.coaches)
        ? data.coaches.map((coachId: any) => ({ coachId }))
        : [{ coachId: "" }], // Default to empty coach if no coaches exist
      image: data.imageUrl as unknown as File,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "coaches",
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
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  async function onSubmit(formData: FormData) {
    const updatedFormData = new FormData();
    updatedFormData.append("id", data.id);
    updatedFormData.append("name", formData.name);
    updatedFormData.append("schedule", formData.schedule);
    updatedFormData.append("description", formData.description);
    updatedFormData.append("existingImageUrl", data.imageUrl || "");

    formData.coaches.forEach((coach: { coachId: string }) => {
      if (coach.coachId) {
        updatedFormData.append("coaches", coach.coachId);
      }
    });

    if (formData.image instanceof File) {
      updatedFormData.append("image", formData.image);
    }

    try {
      const result = await editClass(updatedFormData);
      if (result.status === 200) {
        toast.success(result.message || "Class updated successfully!");
        reset();
        setOpen(false);
        await mutate("/api/classes");
      } else {
        toast.error(result.message || "Error updating class.");
      }
    } catch (error) {
      console.error("Error updating class:", error);
      toast.error("Error updating class. Please try again.");
    }
  }

  // Handle coach data loading error
  if (coachesError && open) {
    console.error("Error loading coaches:", coachesError);
    toast.error("Failed to load coaches. Please try again.");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="">
          <Pencil size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
          <DialogDescription>
            Update the details of this class.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Hidden inputs to pass ID and existingImageUrl */}
          <input type="hidden" {...register("id")} />
          <input type="hidden" {...register("existingImageUrl")} />
          <div>
            <Label htmlFor="name">Class Name</Label>
            <Input
              id="name"
              placeholder="Enter class name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="schedule">Schedule</Label>
            <Input
              id="schedule"
              placeholder="Enter class schedule"
              {...register("schedule")}
            />
            {errors.schedule && (
              <p className="text-sm text-red-500">{errors.schedule.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter class description"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <Label>Coaches</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 mb-2">
                <select
                  {...register(`coaches.${index}.coachId`, {
                    required: "Coach is required",
                  })}
                  className="bg-gray-50 border rounded-md px-3 py-2 flex-grow"
                >
                  <option value="">Select a coach</option>
                  {coachesLoading && (
                    <option disabled>Loading coaches...</option>
                  )}
                  {coaches?.map((coach) => (
                    <option key={coach.id} value={coach.id}>
                      {coach.name}{" "}
                      {coach.specialization ? `- ${coach.specialization}` : ""}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    if (fields.length === 1) {
                      setValue(`coaches.0.coachId`, "");
                    } else {
                      remove(index);
                    }
                  }}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            {errors.coaches && (
              <p className="text-sm text-red-500">
                At least one coach is required
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ coachId: "" })}
            >
              + Add Coach
            </Button>
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
                  src={preview || "/placeholder.svg"}
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
