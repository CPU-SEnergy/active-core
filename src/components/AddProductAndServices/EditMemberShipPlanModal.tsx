"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { mutate } from "swr";
import membershipPlanSchema from "@/lib/zod/schemas/membershipPlanFormSchema";
import { editMembershipPlan } from "@/app/actions/admin/products-services/editMembershipPlan";
import { Pencil, Loader2 } from "lucide-react";

type FormData = z.infer<typeof membershipPlanSchema>;

export function EditMembershipPlanModal({
  data,
}: {
  data: FormData & { id: string };
}) {
  const [open, setOpen] = useState(false);
  const [isLoadingPlanData, setIsLoadingPlanData] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(membershipPlanSchema),
    defaultValues: {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      duration: Number(data.duration),
      planType: data.planType,
    },
  });

  const fetchLatestPlanData = async () => {
    try {
      setIsLoadingPlanData(true);

      const response = await fetch(`/api/membershipPlans/${data.id}`, {
        next: { revalidate: 0 },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch membership plan data: ${response.statusText}`
        );
      }

      const latestData = await response.json();

      if (!latestData) {
        toast.error("Failed to load the latest membership plan data.");
        setIsLoadingPlanData(false);
        return;
      }

      reset({
        name: latestData.name,
        description: latestData.description,
        price: Number(latestData.price),
        duration: Number(latestData.duration),
        planType: latestData.planType,
      });

      setIsLoadingPlanData(false);
    } catch (error) {
      console.error("Error fetching latest membership plan data:", error);
      toast.error(
        "Failed to load the latest membership plan data. Please try again."
      );
      setIsLoadingPlanData(false);
    }
  };

  async function onSubmit(formData: FormData) {
    try {
      const updatedFormData = new FormData();
      updatedFormData.append("id", data.id);
      updatedFormData.append("name", formData.name);
      updatedFormData.append("description", formData.description);

      updatedFormData.append("price", formData.price.toString());
      updatedFormData.append("duration", formData.duration.toString());

      updatedFormData.append("planType", formData.planType);

      const result = await editMembershipPlan(updatedFormData);
      
      if (result.success) {
        setOpen(false);
        mutate("/api/membershipPlans");
        toast.success("Membership plan updated successfully!");
        window.location.reload();
      } else {
        toast.error(result.message || "Error updating membership plan.");
      }
    } catch (error) {
      console.error("Error updating membership plan:", error);
      toast.error("Error updating membership plan. Please try again.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (newOpen) {
          fetchLatestPlanData();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Membership Plan</DialogTitle>
          <DialogDescription>
            Update the details of this membership plan.
          </DialogDescription>
        </DialogHeader>

        {isLoadingPlanData ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <p className="text-sm text-gray-500">Loading latest data...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Plan Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
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
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                step="1"
                min="1"
                {...register("duration", { valueAsNumber: true })}
              />
              {errors.duration && (
                <p className="text-sm text-red-500">
                  {errors.duration.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="planType">Plan Type</Label>
              <Controller
                control={control}
                name="planType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="package">Package</SelectItem>
                      <SelectItem value="walk-in">Walk-in</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.planType && (
                <p className="text-sm text-red-500">
                  {errors.planType.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  disabled={isLoadingPlanData}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isLoadingPlanData}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
