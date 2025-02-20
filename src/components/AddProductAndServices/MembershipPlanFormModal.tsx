"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect } from "react";

const membershipPlanSchema = z.object({
  name: z.string().min(1, "Plan Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.object({
    regular: z.preprocess(
      (val) => Number(val),
      z.number().min(1, "Regular Price must be at least 1")
    ),
    student: z.preprocess(
      (val) => Number(val),
      z.number().min(1, "Student Price must be at least 1")
    ),
    special: z.preprocess(
      (val) => Number(val),
      z.number().min(1, "Special Price must be at least 1")
    ),
  }),
  duration: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Duration must be at least 1 day")
  ),
  status: z.string().min(1, "Status is required").toLowerCase(),
});

type FormData = z.infer<typeof membershipPlanSchema>;

interface MembershipPlan {
  name: string;
  description: string;
  price: { regular: number; student: number; special: number };
  duration: number;
  status: string;
}

interface MembershipPlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: MembershipPlan | null;
}

export function MembershipPlanForm({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: MembershipPlanFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(membershipPlanSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          price: {
            regular: initialData.price.regular,
            student: initialData.price.student,
            special: initialData.price.special,
          },
          duration: initialData.duration,
          status: initialData.status,
        }
      : {
          name: "",
          description: "",
          price: { regular: 0, student: 0, special: 0 },
          duration: 0,
          status: "active",
        },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description,
        price: {
          regular: initialData.price.regular,
          student: initialData.price.student,
          special: initialData.price.special,
        },
        duration: initialData.duration,
        status: initialData.status,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Submitted Data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Membership plan added successfully!");
      reset();
      onSuccess();
      onClose();
      reset();
    } catch (error) {
      console.error("Error adding membership plan:", error);
      toast.error("Error adding membership plan. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {initialData ? "Edit Membership Plan" : "Add Membership Plan"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              placeholder="Enter plan name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter description"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="regular">Regular Price</Label>
            <Input
              id="regular"
              type="number"
              min="1"
              placeholder="Enter regular price"
              {...register("price.regular")}
            />
            {errors.price?.regular && (
              <p className="text-sm text-red-500">
                {errors.price.regular.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="student">Student Price</Label>
            <Input
              id="student"
              type="number"
              min="1"
              placeholder="Enter student price"
              {...register("price.student")}
            />
            {errors.price?.student && (
              <p className="text-sm text-red-500">
                {errors.price.student.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="special">Special Price</Label>
            <Input
              id="special"
              type="number"
              min="1"
              placeholder="Enter special price"
              {...register("price.special")}
            />
            {errors.price?.special && (
              <p className="text-sm text-red-500">
                {errors.price.special.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="duration">Duration (days)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              placeholder="Enter duration"
              {...register("duration")}
            />
            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  value={field.value || "active"}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : initialData
                  ? "Update Plan"
                  : "Add Plan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
