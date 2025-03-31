/* eslint-disable @typescript-eslint/no-explicit-any */

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
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { DialogTrigger } from "@radix-ui/react-dialog";
import membershipPlanSchema from "@/lib/zod/schemas/membershipPlanFormSchema";
import { createMembershipPlan } from "@/app/actions/admin/createMembershipPlan";
import { mutate } from "swr";

type FormData = z.infer<typeof membershipPlanSchema>;

export function MembershipPlanForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(membershipPlanSchema),
    defaultValues: {
      name: "",
      description: "",
      price: { regular: 0, student: 0, discount: 0 },
      duration: 0,
      status: "active",
    },
  });

  const discountPrice = watch("price.discount");

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", JSON.stringify(data.price));
      formData.append("duration", data.duration.toString());
      formData.append("status", data.status);

      if (data.planDateEnd) {
        formData.append(
          "planDateEnd",
          new Date(data.planDateEnd).toISOString()
        );
      }
      const result = await createMembershipPlan(formData);
      console.log("Membership plan data:", data);

      if (result.status === 201) {
        toast.success("Membership plan created successfully!");
        mutate("/api/membership-plan");
      } else {
        toast.error(result.message || "Failed to create membership plan.");
        console.log(result);
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      reset();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="mb-8 py-6 text-base border-2 border-gray-200 bg-white text-black hover:bg-gray-100"
          variant={"outline"}
        >
          Add Membership Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Membership Plan</DialogTitle>
          <DialogDescription>
            Fill in the details for the new membership plan.
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
                Close
              </Button>
            </DialogClose>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Add Membership Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
