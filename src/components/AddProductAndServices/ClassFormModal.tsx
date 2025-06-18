/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash, Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import type { COACHDATA } from "@/lib/types/product-services";
import useSWR, { mutate } from "swr";
import fetcher from "@/lib/fetcher";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { classFormSchema } from "@/lib/zod/schemas/classFormSchema";
import { createClass } from "@/app/actions/admin/products-services/createClass";

type FormData = z.infer<typeof classFormSchema>;

export function ClassesModal() {
  // control dialog open state
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      coaches: [{ coachId: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "coaches",
  });

  const {
    data: coaches,
    error,
    isLoading,
  } = useSWR<COACHDATA[]>("/api/coaches", fetcher, {
    dedupingInterval: 60 * 60 * 24,
  });

  if (error) {
    console.error("Error fetching coaches:", error);
    return <div>Error fetching coaches</div>;
  }

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("schedule", data.schedule);
      formData.append("description", data.description);
      data.coaches.forEach((c) => formData.append("coaches", c.coachId));
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      const result = await createClass(formData);

      if (!result || !result.status) {
        toast.error("Unexpected response from server.");
        return;
      }

      if (result.status === 200) {
        toast.success(result.message || "Class added successfully!");
        reset();
        setPreview(null);
        mutate("/api/classes");
        setOpen(false);
      } else {
        toast.error(result.message || "Error creating a class.");
      }
    } catch (err) {
      console.error("Error creating a class:", err);
      toast.error("Error creating a class. Please try again.");
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/"))
      return toast.error("Please upload an image file");
    setValue("image", file);
    setPreview(URL.createObjectURL(file));
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="mb-8 py-6 text-base border-2 border-gray-200 bg-white text-black hover:bg-gray-100"
          variant="outline"
        >
          Add Class
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full max-h-[90vh]">
          <DialogHeader className="px-1 pt-1">
            <DialogTitle>Add Class</DialogTitle>
            <DialogDescription>
              Fill in the details for creating new class.
            </DialogDescription>
          </DialogHeader>

          <div className="px-1 overflow-y-auto flex-1 pb-1 pt-6">
            <form
              id="class-form"
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4 w-full"
            >
              <div className="grid gap-2">
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
                        {isLoading && (
                          <option disabled>Loading coaches...</option>
                        )}
                        {coaches?.map((coach) => (
                          <option key={coach.id} value={coach.id}>
                            {coach.name} - {coach.specialization}
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
            </form>
          </div>

          <DialogFooter className="border-t py-6 mt-auto gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form="class-form"
              className="bg-black hover:bg-gray-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
