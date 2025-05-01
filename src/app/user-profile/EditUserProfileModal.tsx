"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Schema } from "@/lib/schema/firestore";
import { Edit2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserProfile } from "@/app/actions/updateUserProfile";
import { useState, useTransition } from "react";
import { mutate } from "swr";
import { toast } from "sonner";

type Props = {
  userData: Schema["users"]["Data"];
};

const userProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z
    .union([z.string(), z.date()])
    .optional()
    .refine(
      (date) => !date || !isNaN(new Date(date).getTime()),
      "Invalid date format. It must be in MM-DD-YYYY"
    ),
  sex: z.enum(["male", "female", "other"]),
});

type ProfileFormValues = z.infer<typeof userProfileSchema>;

export default function EditUserProfileModal({ userData }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      dob: new Date(userData.dob).toISOString().split("T")[0],
      sex: userData.sex,
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("id", userData.uid);
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append(
          "dob",
          data.dob ? new Date(data.dob).toISOString() : ""
        );
        formData.append("sex", data.sex);

        const res = await updateUserProfile(formData);
        if (res.status === 200) {
          toast.success(res.message || "Class updated successfully!");
          console.log("Profile updated successfully!");
          await mutate(`/api/user/${userData.uid}`);
          setIsOpen(false);
        } else {
          toast.error("Error updating class. Please try again.");
          console.error("Update failed:", res.message);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="mt-4 md:mt-0 md:ml-4 bg-gray-300 text-black hover:bg-gray-400"
          variant="outline"
        >
          <Edit2 className="mr-2" size={16} />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 mr-8">
              <Label htmlFor="firstName" className="text-right">
                First Name:
              </Label>
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder="John"
                className="col-span-3"
              />
              {errors.firstName && (
                <p className="col-span-4 text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mr-8">
              <Label htmlFor="lastName" className="text-right">
                Last Name:
              </Label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Doe"
                className="col-span-3"
              />
              {errors.lastName && (
                <p className="col-span-4 text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mr-8">
              <Label htmlFor="dob" className="text-right">
                Date of Birth:
              </Label>
              <Input
                id="dob"
                type="date"
                required
                {...register("dob")}
                className="col-span-3"
              />
              {errors.dob && (
                <p className="col-span-4 text-sm text-red-500">
                  {errors.dob.message as string}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mr-8">
              <Label htmlFor="sex" className="text-right">
                Gender:
              </Label>
              <select
                id="sex"
                {...register("sex")}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.sex && (
                <p className="col-span-4 text-sm text-red-500">
                  {errors.sex.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
