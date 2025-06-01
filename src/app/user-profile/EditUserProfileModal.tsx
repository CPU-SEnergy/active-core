/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { mutate } from "swr";
import { toast } from "sonner";
import parsePhoneNumber from "libphonenumber-js";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { Schema } from "@/lib/schema/firestore";
import { Loader2, Edit } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserProfile } from "@/app/actions/updateUserProfile";
import {
  hundredYearsAgo,
  oneYearAgo,
  today,
} from "@/lib/schema/auth/registerSchema";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters")
    .refine((value) => /^[a-zA-Z\s\-']+$/.test(value.trim()), {
      message:
        "First name can only contain letters, spaces, hyphens, and apostrophes",
    })
    .transform((value) =>
      value
        .trim()
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    ),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters")
    .refine((value) => /^[a-zA-Z\s\-']+$/.test(value.trim()), {
      message:
        "Last name can only contain letters, spaces, hyphens, and apostrophes",
    })
    .transform((value) =>
      value
        .trim()
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    ),
  phone: z
    .string()
    .optional()
    .transform((val) => (val ? val : ""))
    .refine(
      (value) => {
        if (!value) return true;
        const digitsOnly = value.replace(/\D/g, "");
        return digitsOnly.length === 11;
      },
      {
        message: "Phone number must be exactly 11 digits",
      }
    )
    .refine(
      (value) => {
        if (!value) return true;
        const digitsOnly = value.replace(/\D/g, "");
        return digitsOnly.startsWith("09");
      },
      {
        message: "Phone number must start with 09",
      }
    )
    .transform((value, ctx) => {
      if (!value) return "";

      const digitsOnly = value.replace(/\D/g, "");

      if (digitsOnly.length !== 11 || !digitsOnly.startsWith("09")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Invalid Philippine phone number (must be 11 digits starting with 09)",
        });
        return z.NEVER;
      }

      try {
        const phoneNumber = parsePhoneNumber(`+63${digitsOnly.slice(1)}`, "PH");

        if (!phoneNumber?.isValid()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid Philippine phone number",
          });
          return z.NEVER;
        }

        return digitsOnly;
      } catch (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid phone number format",
        });
        return z.NEVER;
      }
    }),
  dob: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
      },
      {
        message: "Invalid date format",
      }
    )
    .refine(
      (date) => {
        if (!date) return true;
        const parsedDate = new Date(date);
        return parsedDate >= hundredYearsAgo && parsedDate <= oneYearAgo;
      },
      {
        message: "Age must be between 1 and 100 years",
      }
    )
    .refine(
      (date) => {
        if (!date) return true;
        const parsedDate = new Date(date);
        return parsedDate <= today;
      },
      {
        message: "Date of birth cannot be in the future",
      }
    ),
  sex: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),
});

interface EditUserProfileModalProps {
  userData: Schema["users"]["Data"];
  children?: React.ReactNode;
}

export default function EditUserProfileModal({
  userData,
}: EditUserProfileModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const formatDateForInput = (date: any): string => {
    if (!date) return "";

    try {
      let dateObj: Date;

      if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === "string") {
        dateObj = new Date(date);
      } else if (date.seconds) {
        dateObj = new Date(date.seconds * 1000);
      } else {
        return "";
      }

      if (isNaN(dateObj.getTime())) return "";
      const isoString = dateObj.toISOString();
      return isoString.split("T")[0] || "";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      phone: userData.phone || "",
      dob: formatDateForInput(userData.dob),
      sex: userData.sex || undefined,
    },
  });

  const formatPhoneNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");

    if (digitsOnly.length === 0) return "";

    if (digitsOnly.length === 1 && digitsOnly !== "0") {
      return "09" + digitsOnly;
    }

    if (
      digitsOnly.length === 2 &&
      digitsOnly[0] === "0" &&
      digitsOnly[1] !== "9"
    ) {
      return "09" + digitsOnly[1];
    }

    return digitsOnly.slice(0, 11);
  };

  const handlePhoneChange = (
    value: string,
    onChange: (value: string) => void
  ) => {
    const formatted = formatPhoneNumber(value);
    onChange(formatted);
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentValue = (e.target as HTMLInputElement).value;

    if (
      [8, 9, 27, 13, 37, 38, 39, 40, 46].indexOf(e.keyCode) !== -1 ||
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return;
    }

    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }

    if (currentValue.length >= 11 && ![8, 46].includes(e.keyCode)) {
      e.preventDefault();
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("id", userData.uid);
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append(
          "dob",
          values.dob ? new Date(values.dob).toISOString() : ""
        );
        formData.append("sex", values.sex || "");
        formData.append("phone", values.phone || "");

        const res = await updateUserProfile(formData);

        if (res.status === 200) {
          toast.success(res.message || "Profile updated successfully!");
          mutate(`/api/user/${userData.uid}`);
          setOpen(false);
        } else {
          toast.error(
            res.message || "Error updating profile. Please try again."
          );
        }
      } catch (error) {
        console.error("Update failed", error);
        toast.error("Something went wrong.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Edit className="h-3 w-3" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader className="space-y-1">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your information</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="09XXXXXXXXX"
                      {...field}
                      onChange={(e) =>
                        handlePhoneChange(e.target.value, field.onChange)
                      }
                      onKeyDown={handlePhoneKeyDown}
                      maxLength={11}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
