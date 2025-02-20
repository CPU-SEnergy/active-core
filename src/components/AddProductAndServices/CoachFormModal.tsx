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

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  specialization: z.string().min(1, "Specialty is required"),
  contactInfo: z.string().min(1, "Contact info is required"),
  dob: z.preprocess(
    (val) => {
      if (typeof val === "string" || val instanceof Date) {
        return new Date(val);
      }
      return val;
    },
    z.date({ required_error: "Date of birth is required" })
  ),
  experience: z.preprocess(
    (val) => Number(val),
    z.number().gt(0, "Experience must be greater than 0")
  ),
  certifications: z
    .array(z.string().min(1, "Certification is required"))
    .min(1, { message: "At least one certification is required" }),
  bio: z.string().min(1, "Bio is required"),
  image: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CoachFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CoachForm({ isOpen, onClose, onSuccess }: CoachFormProps) {
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
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Form data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      reset();
      toast.success("Coach added successfully!");
      setPreview(null);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding coach:", error);
      toast.error("Error adding coach. Please try again.");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Add Coach</h2>

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
            <Label htmlFor="specialty">Contact Info</Label>
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
            <Label htmlFor="experience">Experience</Label>
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black hover:bg-gray-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Coach"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
