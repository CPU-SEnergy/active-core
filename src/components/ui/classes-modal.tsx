import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Upload } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  schedule: z.string().min(1, "Schedule is required"),
  location: z.string().min(1, "Location is required"),
  coach: z.string().min(1, "Coach is required"),
  description: z.string().min(1, "Description is required"),
  image: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ClassesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  coaches: { id: string; name: string }[];
}

export function ClassesModal({ isOpen, onClose, onSuccess, coaches }: ClassesModalProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Form data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Class created successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error("Error creating class. Please try again.");
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Please upload an image file");
    setValue("image", file);
    setPreview(URL.createObjectURL(file));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Add Class</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Class Name</Label>
            <Input id="name" placeholder="Enter class name" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="schedule">Schedule</Label>
            <Input id="schedule" placeholder="Enter class schedule" {...register("schedule")} />
            {errors.schedule && <p className="text-sm text-red-500">{errors.schedule.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="Enter class location" {...register("location")} />
            {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="coach">Coach</Label>
            <select id="coach" {...register("coach")} className="bg-gray-50 border rounded-md px-3 py-2">
              <option value="">Select a coach</option>
              {coaches.map((coach) => (
                <option key={coach.id} value={coach.id}>{coach.name}</option>
              ))}
            </select>
            {errors.coach && <p className="text-sm text-red-500">{errors.coach.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter class description" {...register("description")} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label>Upload Image</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500">Click to upload an image</p>
                <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                  Browse Files
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".png,.jpg,.jpeg"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>
            </div>
            {preview && (
              <div className="flex justify-center mt-2">
                <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-md" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-black hover:bg-gray-800" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}