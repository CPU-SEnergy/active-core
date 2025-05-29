/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import fetcher from "@/lib/fetcher";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { addCustomerWithPayment } from "@/app/actions/customers/addCustomerWithPayment";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search, X, CheckCircle2, AlertCircle } from "lucide-react";

const customerPaymentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  sex: z.enum(["male", "female", "other"]),
  type: z.enum(["regular", "student", "senior"]),
  membershipPlanId: z.string().min(1, "Membership plan is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  isWalkIn: z.boolean().default(false),
  userId: z.string().optional(),
});

type FormData = z.infer<typeof customerPaymentSchema>;

export function CustomerPaymentModal() {
  const [open, setOpen] = useState(false);
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userSelectionError, setUserSelectionError] = useState<string | null>(
    null
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(customerPaymentSchema),
    defaultValues: {
      isWalkIn: false,
      sex: "male",
      type: "regular",
      paymentMethod: "cash",
    },
  });

  const {
    data: membershipPlans,
    error: plansError,
    isLoading: plansLoading,
  } = useSWR(open ? "/api/membershipPlans" : null, fetcher, {
    dedupingInterval: 60 * 60 * 24,
  });

  const {
    data: users,
    error: usersError,
    isLoading: usersLoading,
  } = useSWR(open && !isWalkIn ? "/api/user" : null, fetcher, {
    dedupingInterval: 60 * 60 * 24,
    onSuccess: (data) => {
      if (Array.isArray(data)) {
        setFilteredUsers(data);
      }
    },
  });

  useEffect(() => {
    if (Array.isArray(users)) {
      if (!searchQuery) {
        setFilteredUsers(users);
      } else {
        const query = searchQuery.toLowerCase();
        const filtered = users.filter(
          (user) =>
            user.firstName.toLowerCase().includes(query) ||
            user.lastName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
      }
    }
  }, [searchQuery, users]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      // Don't reset the form when the dialog opens
      setUserSelectionError(null);
    }
  }, [open]);

  if (plansError) {
    console.error("Error fetching membership plans:", plansError);
  }

  if (usersError && !isWalkIn) {
    console.error("Error fetching users:", usersError);
  }

  const onSubmit = async (data: FormData) => {
    try {
      // Clear any previous user selection errors
      setUserSelectionError(null);

      if (isWalkIn) {
        data.userId = undefined;
      } else if (!selectedUserId) {
        setUserSelectionError("Please select a user");
        return;
      } else {
        // Ensure userId is set in the form data
        data.userId = selectedUserId;
        console.log("Submitting with userId:", selectedUserId);
      }

      console.log("Submitting form with data:", data);
      console.log("Selected user ID at submission:", selectedUserId);

      const result = await addCustomerWithPayment(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || "",
          sex: data.sex,
          type: data.type,
          userId: data.userId as any,
        },
        data.membershipPlanId as any,
        data.paymentMethod,
        data.isWalkIn
      );

      if (result.success) {
        toast.success(result.message);
        reset();
        setSelectedUserId(null);
        mutate("/api/payments");
        mutate("/api/active-customer"); // Refresh the customer list
        setOpen(false);
      } else {
        toast.error(result.error || "Failed to process payment");
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      toast.error("Error processing payment. Please try again.");
    }
  };

  const handleWalkInToggle = (checked: boolean) => {
    setIsWalkIn(checked);
    setValue("isWalkIn", checked);
    setUserSelectionError(null);

    if (checked) {
      clearUserSelection();
    } else {
      setValue("firstName", "");
      setValue("lastName", "");
      setValue("email", "");
      setValue("phone", "");
    }
  };

  const handleUserSelect = (user: any) => {
    // Clear any previous user selection errors
    setUserSelectionError(null);

    // If the user is already selected, unselect them
    if (selectedUserId === user.uid) {
      clearUserSelection();
      return;
    }

    // Set the selected user ID
    setSelectedUserId(user.uid);

    // Explicitly set the userId in the form
    setValue("userId", user.uid);

    // Set the form values
    setValue("firstName", user.firstName);
    setValue("lastName", user.lastName);
    setValue("email", user.email);
    setValue("phone", user.phone || "");
    setValue("sex", user.sex || "male");
    setValue("type", user.type || "regular");

    // Clear search after selection
    setSearchQuery("");

    // Show a success toast
    toast.success(`Selected user: ${user.firstName} ${user.lastName}`);

    console.log("User selected:", user.id);
    console.log("Form userId value:", watch("userId"));
  };

  const clearUserSelection = () => {
    setSelectedUserId(null);
    setValue("userId", undefined);
    setValue("firstName", "");
    setValue("lastName", "");
    setValue("email", "");
    setValue("phone", "");
    setValue("sex", "male");
    setValue("type", "regular");
    setUserSelectionError(null);

    console.log("User selection cleared");
    console.log("Form userId value after clear:", watch("userId"));
  };

  // Find the selected user object - using uid instead of id
  const selectedUser =
    selectedUserId && Array.isArray(users)
      ? users.find((user: any) => user.uid === selectedUserId)
      : null;

  const handleProcessPayment = () => {
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="mb-8 py-6 text-base border-2 border-gray-200 bg-white text-black hover:bg-gray-100"
          variant="outline"
          onClick={handleProcessPayment}
        >
          Process Payment
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-full max-w-full max-h-[90vh]  overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col h-full max-h-[90vh]">
          <DialogHeader className="px-1 pt-1">
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Add a customer and process their membership payment.
            </DialogDescription>
          </DialogHeader>

          <div className="px-1 flex-1 pb-1 pt-6">
            <form
              id="payment-form"
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4 w-full max-w-full box-border"
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="isWalkIn">Walk-in Customer</Label>
                <Switch
                  id="isWalkIn"
                  checked={isWalkIn}
                  onCheckedChange={handleWalkInToggle}
                />
              </div>

              {!isWalkIn && (
                <div className="grid gap-2 w-full max-w-full">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="userId">Select User</Label>
                    {selectedUserId && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={clearUserSelection}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear selection
                      </Button>
                    )}
                  </div>

                  {userSelectionError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-2 flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {userSelectionError}
                    </div>
                  )}

                  {/* Hidden input to ensure userId is included in form data */}
                  <input
                    type="hidden"
                    name="userId"
                    value={selectedUserId || ""}
                  />

                  {selectedUser ? (
                    <div className="border rounded-md p-3 bg-green-50 flex items-start gap-3">
                      <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="font-medium truncate">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {selectedUser.email}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0 h-8 w-8 p-0"
                        onClick={clearUserSelection}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear selection</span>
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          type="text"
                          placeholder="Search users by name or email..."
                          className="pl-10 w-full mb-2"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setSearchQuery("")}
                          >
                            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          </button>
                        )}
                      </div>
                      <div className="border rounded-md max-h-[200px] overflow-y-auto w-full">
                        {usersLoading ? (
                          <div className="p-3 text-sm text-gray-500 flex items-center justify-center">
                            <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent mr-2"></div>
                            Loading users...
                          </div>
                        ) : usersError ? (
                          <div className="p-3 text-sm text-red-500">
                            Error loading users
                          </div>
                        ) : !Array.isArray(filteredUsers) ? (
                          <div className="p-3 text-sm text-gray-500">
                            Invalid user data format
                          </div>
                        ) : filteredUsers.length === 0 ? (
                          <div className="p-3 text-sm text-gray-500">
                            No users found
                          </div>
                        ) : (
                          filteredUsers.map((user: any) => (
                            <div
                              key={user.uid}
                              className={`p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-2 ${
                                user.uid === selectedUserId ? "bg-green-50" : ""
                              }`}
                              onClick={() => handleUserSelect(user)}
                            >
                              <div className="flex-grow min-w-0">
                                <div className="font-medium truncate">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500 truncate">
                                  {user.email}
                                </div>
                              </div>
                              {user.uid === selectedUserId && (
                                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="grid gap-2 w-full max-w-full">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  {...register("firstName")}
                  disabled={!isWalkIn && !!selectedUserId}
                  className={!isWalkIn && !!selectedUserId ? "bg-gray-50" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2 w-full max-w-full">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  {...register("lastName")}
                  disabled={!isWalkIn && !!selectedUserId}
                  className={!isWalkIn && !!selectedUserId ? "bg-gray-50" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2 w-full max-w-full">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  {...register("email")}
                  disabled={!isWalkIn && !!selectedUserId}
                  className={!isWalkIn && !!selectedUserId ? "bg-gray-50" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2 w-full max-w-full">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  {...register("phone")}
                  disabled={!isWalkIn && !!selectedUserId}
                  className={!isWalkIn && !!selectedUserId ? "bg-gray-50" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="grid gap-2 w-full max-w-full">
                <Label>Sex</Label>
                <RadioGroup
                  defaultValue="male"
                  value={watch("sex")}
                  onValueChange={(value) =>
                    setValue("sex", value as "male" | "female" | "other")
                  }
                  disabled={!isWalkIn && !!selectedUserId}
                  className="w-full max-w-full"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
                {errors.sex && (
                  <p className="text-sm text-red-500">{errors.sex.message}</p>
                )}
              </div>

              <div className="grid gap-2 w-full max-w-full">
                <Label>Customer Type</Label>
                <RadioGroup
                  defaultValue="regular"
                  value={watch("type")}
                  onValueChange={(value) =>
                    setValue("type", value as "regular" | "student" | "senior")
                  }
                  disabled={!isWalkIn && !!selectedUserId}
                  className="w-full max-w-full"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regular" id="regular" />
                    <Label htmlFor="regular">Regular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="senior" id="senior" />
                    <Label htmlFor="senior">Senior</Label>
                  </div>
                </RadioGroup>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>

              <div className="grid gap-2 w-full max-w-full">
                <Label htmlFor="membershipPlanId">Membership Plan</Label>
                <Select
                  onValueChange={(value) => setValue("membershipPlanId", value)}
                >
                  <SelectTrigger className="w-full max-w-full">
                    <SelectValue placeholder="Select a membership plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plansLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading plans...
                      </SelectItem>
                    ) : (
                      membershipPlans?.map((plan: any) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - ${plan.price} ({plan.duration} days)
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.membershipPlanId && (
                  <p className="text-sm text-red-500">
                    {errors.membershipPlanId.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2 w-full max-w-full">
                <Label>Payment Method</Label>
                <RadioGroup
                  defaultValue="cash"
                  onValueChange={(value) => setValue("paymentMethod", value)}
                  className="w-full max-w-full"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash">Cash</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card">Credit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="debit_card" id="debit_card" />
                    <Label htmlFor="debit_card">Debit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Label htmlFor="bank_transfer">Bank Transfer</Label>
                  </div>
                </RadioGroup>
                {errors.paymentMethod && (
                  <p className="text-sm text-red-500">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>
            </form>
          </div>

          <DialogFooter className="border-t py-6 mt-auto gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form="payment-form"
              className="bg-black hover:bg-gray-800"
              disabled={isSubmitting}
              onClick={() => {
                if (!isWalkIn && !selectedUserId) {
                  setUserSelectionError("Please select a user");
                  return;
                }
                setUserSelectionError(null);
              }}
            >
              {isSubmitting ? "Processing..." : "Process Payment"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
