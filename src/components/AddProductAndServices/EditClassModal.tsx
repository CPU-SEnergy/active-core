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
  const [dragActive, setDragActive] = useState(false);
  const [isLoadingClassData, setIsLoadingClassData] = useState(false);

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
      coaches: Array.isArray(data.coaches)
        ? data.coaches.map((coachId: any) => ({ coachId }))
        : [{ coachId: "" }],
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const fetchLatestClassData = async () => {
    try {
      setIsLoadingClassData(true);

      const response = await fetch(`/api/classes/${data.id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch class data: ${response.statusText}`);
      }

      const latestData = await response.json();

      if (!latestData) {
        toast.error("Failed to load the latest class data.");
        setIsLoadingClassData(false);
        return;
      }

      reset({
        id: latestData.id,
        name: latestData.name,
        schedule: latestData.schedule,
        description: latestData.description,
        coaches: Array.isArray(latestData.coaches)
          ? latestData.coaches.map((coachId: any) => ({ coachId }))
          : [{ coachId: "" }],
        image: latestData.imageUrl as unknown as File,
        existingImageUrl: latestData.imageUrl || "",
      });

      setIsLoadingClassData(false);
    } catch (error) {
      console.error("Error fetching latest class data:", error);
      toast.error("Failed to load the latest class data. Please try again.");
      setIsLoadingClassData(false);
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

      if (!result || !result.status) {
        toast.error("Unexpected response from server.");
        return;
      }

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

  if (coachesError && open) {
    console.error("Error loading coaches:", coachesError);
    toast.error("Failed to load coaches. Please try again.");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (newOpen) {
          fetchLatestClassData();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="">
          <Pencil size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-full max-h-[90vh] overflow-x-hidden overflow-y-auto">
        <div className="flex flex-col h-full max-h-[90vh]">
          <DialogHeader className="px-1 pt-1">
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>
              Update the details of this class.
            </DialogDescription>
          </DialogHeader>

          {isLoadingClassData ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
                <p className="text-sm text-gray-500">Loading latest data...</p>
              </div>
            </div>
          ) : (
            <div className="px-1 flex-1 pb-1 pt-6">
              <form
                id="edit-class-form"
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-4 w-full"
              >
                {/* Hidden inputs to pass ID and existingImageUrl */}
                <input type="hidden" {...register("id")} />
                <input type="hidden" {...register("existingImageUrl")} />

                <div className="grid gap-2">
                  <Label htmlFor="name">Class Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter class name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="schedule">Schedule</Label>
                  <Input
                    id="schedule"
                    placeholder="Enter class schedule"
                    {...register("schedule")}
                  />
                  {errors.schedule && (
                    <p className="text-sm text-red-500">
                      {errors.schedule.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
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

                <Label>Coaches</Label>
                <div className="border p-2 rounded gap-2 flex flex-col w-full">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col gap-2 w-full">
                      <div className="flex items-center gap-2 w-full">
                        <select
                          {...register(`coaches.${index}.coachId`, {
                            required: "Coach is required",
                          })}
                          className="bg-gray-50 border rounded-md px-3 py-2 flex-grow w-full"
                        >
                          <option value="">Select a coach</option>
                          {coachesLoading && (
                            <option disabled>Loading coaches...</option>
                          )}
                          {coaches?.map((coach) => (
                            <option key={coach.id} value={coach.id}>
                              {coach.name}{" "}
                              {coach.specialization
                                ? `- ${coach.specialization}`
                                : ""}
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
                          className="flex-shrink-0"
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      {errors.coaches?.[index]?.coachId && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.coaches[index].coachId.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ coachId: "" })}
                >
                  + Add Coach
                </Button>

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
              </form>
            </div>
          )}

          <div className="border-t py-6 mt-auto">
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                form="edit-class-form"
                className="bg-black hover:bg-gray-800"
                disabled={isSubmitting || isLoadingClassData}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
