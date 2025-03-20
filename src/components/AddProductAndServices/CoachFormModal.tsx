/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash, Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { createCoach } from "@/app/actions/admin/createCoach";
import { mutate } from "swr";
import coachFormSchema from "@/lib/zod/schemas/coachFormSchema";
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

type FormData = z.infer<typeof coachFormSchema>;

export function CoachForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(coachFormSchema),
    defaultValues: {
      name: "",
      specialization: "",
      contactInfo: "",
      dob: "",
      experience: 0,
      certifications: [""],
      bio: "",
      image: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("specialization", data.specialization);
      formData.append("contactInfo", data.contactInfo);
      formData.append("dob", data.dob ? data.dob.toString() : "");
      formData.append("experience", data.experience.toString());
      formData.append("bio", data.bio);

      data.certifications.forEach((cert) =>
        formData.append("certifications", cert)
      );

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      const result = await createCoach(formData);
      console.log("createCoach result:", result);

      if (!result || !result.status) {
        toast.error("Unexpected response from server.");
        return;
      }

      if (result.status === 200) {
        toast.success(result.message || "Coach added successfully!");

        reset();
        setPreview(null);
        await mutate("/api/coaches");
      } else {
        toast.error(result.message || "Error creating a coach.");
      }
    } catch (error) {
      console.error("Error creating a coach:", error);
      toast.error("Error creating a coach. Please try again.");
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="mb-8 py-6 text-base border-2 border-gray-200 bg-white text-black hover:bg-gray-100"
          variant={"outline"}
        >
          Add Coach
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Coach</DialogTitle>
          <DialogDescription>
            Fill in the details for creating new coaches.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter coach name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="specialization">Specialty</Label>
            <Input
              id="specialization"
              placeholder="Enter coach specialization"
              {...register("specialization")}
            />
            {errors.specialization && (
              <p className="text-sm text-red-500">
                {errors.specialization.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" type="date" {...register("dob")} />
            {errors.dob && (
              <p className="text-sm text-red-500">{errors.dob.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contactInfo">Contact Info</Label>
            <Input
              id="contactInfo"
              placeholder="Enter coach contact info"
              {...register("contactInfo")}
            />
            {errors.contactInfo && (
              <p className="text-sm text-red-500">
                {errors.contactInfo.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="experience">Years Experience</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              placeholder="Enter years of experience"
              {...register("experience")}
            />
            {errors.experience && (
              <p className="text-sm text-red-500">
                {errors.experience.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Certifications</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  placeholder="Enter certification"
                  {...register(`certifications.${index}` as const)}
                />
                {errors.certifications &&
                  Array.isArray(errors.certifications) &&
                  errors.certifications[index] && (
                    <p className="text-sm text-red-500">
                      {(errors.certifications[index] as any).message}
                    </p>
                  )}
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
            {errors.certifications && !Array.isArray(errors.certifications) && (
              <p className="text-sm text-red-500">
                {errors.certifications.message}
              </p>
            )}
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
            {preview && (
              <div className="flex justify-center mt-2">
                <Image
                  width={96}
                  height={96}
                  sizes="96px"
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-md"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
