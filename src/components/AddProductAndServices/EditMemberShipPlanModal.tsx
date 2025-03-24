/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { editMembershipPlan } from "@/app/actions/admin/editMembershipPlan";
import { Pencil } from "lucide-react";

type FormData = z.infer<typeof membershipPlanSchema>;

export function EditMembershipPlanModal({
  data,
}: {
  data: FormData & { id: string };
}) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(membershipPlanSchema),
    defaultValues: {
      name: data.name,
      description: data.description,
      price: data.price,
      duration: data.duration,
      status: data.status,
      planDateEnd: data.planDateEnd
        ? new Date(data.planDateEnd).toISOString().split("T")[0]
        : "",
    },
  });

  const discountPrice = watch("price.discount");

  async function onSubmit(formData: FormData) {
    try {
      const updatedFormData = new FormData();
      updatedFormData.append("id", data.id);
      updatedFormData.append("name", formData.name);
      updatedFormData.append("description", formData.description);
      updatedFormData.append("price", JSON.stringify(formData.price));
      updatedFormData.append("duration", formData.duration.toString());
      updatedFormData.append("status", formData.status);

      if (formData.planDateEnd) {
        updatedFormData.append(
          "planDateEnd",
          new Date(formData.planDateEnd).toISOString()
        );
      }

      const result = await editMembershipPlan(updatedFormData);

      if (result.status === 200) {
        toast.success("Membership plan updated successfully!");
        await mutate("/api/membership-plan");
        setOpen(false);
      } else {
        toast.error(result.message || "Error updating membership plan.");
      }
    } catch (error) {
      console.error("Error updating membership plan:", error);
      toast.error("Error updating membership plan. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer">
          <Pencil size={20} />
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Membership Plan</DialogTitle>
          <DialogDescription>
            Update the details of this membership plan.
          </DialogDescription>
        </DialogHeader>

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

          {(["regular", "student", "discount"] as const).map((type) => (
            <div key={type}>
              <Label
                htmlFor={type}
              >{`${type.charAt(0).toUpperCase() + type.slice(1)} Price`}</Label>
              <Input
                id={type}
                type="number"
                min="0"
                {...register(`price.${type}`)}
              />
              {errors.price?.[type] && (
                <p className="text-sm text-red-500">
                  {errors.price[type]?.message}
                </p>
              )}
            </div>
          ))}

          <div>
            <Label htmlFor="duration">Duration (days)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              {...register("duration")}
            />
            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
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

          {discountPrice > 0 && (
            <div>
              <Label htmlFor="planDateEnd">
                Plan End Date (for Special Price Promo)
              </Label>
              <Input
                id="planDateEnd"
                type="date"
                {...register("planDateEnd")}
              />
              {errors.planDateEnd && (
                <p className="text-sm text-red-500">
                  {errors.planDateEnd.message}
                </p>
              )}
            </div>
          )}

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
