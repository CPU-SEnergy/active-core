import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Trash } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  specialty: z.string().min(1, "Specialty is required"),
  experience: z.string().min(1, "Experience is required"),
  certifications: z.array(z.string().min(1, "Certification is required")),
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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { certifications: [""] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Form data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Coach added successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding coach:", error);
      toast.error("Error adding coach. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Add Coach</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter coach name" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Input id="specialty" placeholder="Enter coach specialty" {...register("specialty")} />
            {errors.specialty && <p className="text-sm text-red-500">{errors.specialty.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="experience">Experience</Label>
            <Input id="experience" placeholder="Enter years of experience" {...register("experience")} />
            {errors.experience && <p className="text-sm text-red-500">{errors.experience.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label>Certifications</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  placeholder="Enter certification"
                  {...register(`certifications.${index}` as const)}
                />
                <Button type="button" variant="ghost" onClick={() => remove(index)}>
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append("")}>+ Add Certification</Button>
            {errors.certifications && <p className="text-sm text-red-500">{errors.certifications.message as string}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Enter coach bio" {...register("bio")} />
            {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-black hover:bg-gray-800" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Coach"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
