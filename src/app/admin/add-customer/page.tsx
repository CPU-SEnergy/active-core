/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addCustomerWithPayment } from "@/app/actions/customers/addCustomerWithPayment";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import useSWR, { mutate } from "swr";
import fetcher from "@/lib/fetcher";
import type { Schema } from "@/lib/schema/firestore";
import { CustomerPaymentModal } from "@/components/AddCustomer/CustomerForm";
import { Badge } from "@/components/ui/badge";

type Customer = {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  price: number;
  requestNumber: string;
  timeApproved: string;
  subscription: string;
  remainingTime: string;
};

const AddCustomerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    sex: "male" as "male" | "female" | "other",
    type: "regular" as "regular" | "student" | "senior",
    membership: "",
    paymentMethod: "cash",
  });
  const [selectedMembership, setSelectedMembership] = useState<string>("");

  const {
    data: customers,
    error: customersError,
    isLoading: customersLoading,
  } = useSWR<Customer[]>("/api/admin/active-customers", fetcher, {
    dedupingInterval: 5000,
  });

  const {
    data: membershipPlans,
    error: plansError,
    isLoading: plansLoading,
  } = useSWR("/api/membershipPlans", fetcher, {
    dedupingInterval: 60 * 60 * 24,
  });

  if (customersError) {
    console.error("Error fetching active customers:", customersError);
  }

  if (plansError) {
    console.error("Error fetching membership plans:", plansError);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMembershipSelect = (membership: string) => {
    setSelectedMembership(membership);
    setFormData((prev) => ({ ...prev, membership }));
    setIsMembershipModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!formData.membership) {
      toast.error("Please select a membership plan");
      return;
    }

    try {
      setIsSubmitting(true);

      const selectedPlan = membershipPlans?.find(
        (plan: any) => plan.id === formData.membership
      );
      if (!selectedPlan) {
        toast.error("Selected membership plan not found");
        return;
      }

      const result = await addCustomerWithPayment(
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          sex: formData.sex,
          type: formData.type,
          userId: "" as Schema["users"]["Id"],
        },
        formData.membership as Schema["membershipPlans"]["Id"],
        formData.paymentMethod,
        isWalkIn
      );

      if (result.success) {
        toast.success(result.message);

        setIsModalOpen(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          sex: "male",
          type: "regular",
          membership: "",
          paymentMethod: "cash",
        });
        setSelectedMembership("");

        await mutate("/api/admin/active-customers");
      } else {
        toast.error(result.error || "Failed to process payment");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Error processing payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openMembershipModal = () => {
    setIsMembershipModalOpen(true);
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-center sm:text-left">
          Add Customer
        </h1>
        <div className="flex flex-row gap-2 w-full sm:w-auto justify-center">
          <CustomerPaymentModal />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recently added</h2>
        <div className="overflow-auto border rounded-md">
          {customersLoading ? (
            <div className="p-4 text-center">
              <div className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent mr-2"></div>
                Loading customers...
              </div>
            </div>
          ) : customersError ? (
            <div className="p-4 text-center text-red-500">
              Error loading customers
            </div>
          ) : !customers || customers.length === 0 ? (
            <div className="p-4 text-center">No customers found</div>
          ) : (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>Customer</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Request #</TableHead>
                  <TableHead>Time Approved</TableHead>
                  <TableHead>Remaining Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id} className="text-sm">
                    <TableCell>
                      <div className="font-medium">
                        {customer.firstName} {customer.lastName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{customer.subscription}</Badge>
                    </TableCell>
                    <TableCell>₱{customer.price.toLocaleString()}</TableCell>
                    <TableCell>{customer.requestNumber}</TableCell>
                    <TableCell>{customer.timeApproved}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          customer.remainingTime === "0 Days"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }
                      >
                        {customer.remainingTime}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[90vw] max-w-md mx-auto p-4 rounded-lg">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-lg font-bold">
              Add New Customer
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2 overflow-y-auto scrollbar-hide max-h-[60vh]">
            <div className="flex items-center justify-between">
              <Label htmlFor="isWalkIn">Walk-in Customer</Label>
              <Switch
                id="isWalkIn"
                checked={isWalkIn}
                onCheckedChange={(checked) => setIsWalkIn(checked)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="h-9"
                  placeholder="Juan"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="h-9"
                  placeholder="Dela Cruz"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="h-9"
                placeholder="juan.delacruz@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="h-9"
                placeholder="+63 917 123 4567"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Sex</Label>
              <RadioGroup
                value={formData.sex}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    sex: value as "male" | "female" | "other",
                  }))
                }
                className="flex flex-wrap gap-3 mt-1"
              >
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="text-sm">
                    Male
                  </Label>
                </div>
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="text-sm">
                    Female
                  </Label>
                </div>
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="text-sm">
                    Others
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Customer Type</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: value as "regular" | "student" | "senior",
                  }))
                }
                className="flex flex-wrap gap-3 mt-1"
              >
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="regular" id="regular" />
                  <Label htmlFor="regular" className="text-sm">
                    Regular
                  </Label>
                </div>
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student" className="text-sm">
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="senior" id="senior" />
                  <Label htmlFor="senior" className="text-sm">
                    Senior
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Membership</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="membership"
                  name="membership"
                  value={selectedMembership}
                  placeholder="Select a membership plan"
                  readOnly
                  onClick={openMembershipModal}
                  className="cursor-pointer h-9 flex-1 text-sm"
                />
                <Button
                  type="button"
                  onClick={openMembershipModal}
                  className="whitespace-nowrap h-9 text-sm px-3"
                >
                  Choose
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Payment Method</Label>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, paymentMethod: value }))
                }
                className="flex flex-wrap gap-3 mt-1"
              >
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="text-sm">
                    Cash
                  </Label>
                </div>
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="text-sm">
                    Credit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="debit_card" id="debit_card" />
                  <Label htmlFor="debit_card" className="text-sm">
                    Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                  <Label htmlFor="bank_transfer" className="text-sm">
                    Bank Transfer
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1 h-9 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="w-full sm:w-auto order-1 sm:order-2 h-9 text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Add Customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Membership Selection Modal */}
      <Dialog
        open={isMembershipModalOpen}
        onOpenChange={setIsMembershipModalOpen}
      >
        <DialogContent className="w-[90vw] max-w-2xl mx-auto p-4 rounded-lg">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-lg font-bold">
              Select Membership Plan
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto scrollbar-hide max-h-[60vh] py-2">
            {plansLoading ? (
              <div className="text-center py-4">
                Loading membership plans...
              </div>
            ) : plansError ? (
              <div className="text-center py-4 text-red-500">
                Error loading membership plans
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {membershipPlans?.map((plan: any) => (
                  <div
                    key={plan.id}
                    className={`border-2 rounded-lg p-3 h-full flex flex-col ${
                      selectedMembership === plan.name
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <div className="mb-2">
                      <h3 className="text-base font-bold">{plan.name}</h3>
                      <p className="text-base font-semibold">
                        ${plan.price}/month
                      </p>
                    </div>
                    <div className="mb-2 flex-1">
                      <p className="mb-2 text-xs">{plan.description}</p>
                      <p className="text-xs">Duration: {plan.duration} days</p>
                    </div>
                    <div className="mt-auto pt-2">
                      <Button
                        className="w-full h-8 text-xs"
                        onClick={() => {
                          handleMembershipSelect(plan.name);
                          setFormData((prev) => ({
                            ...prev,
                            membership: plan.id,
                          }));
                        }}
                        variant={
                          selectedMembership === plan.name
                            ? "default"
                            : "outline"
                        }
                      >
                        {selectedMembership === plan.name
                          ? "Selected"
                          : "Select Plan"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsMembershipModalOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1 h-9 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setIsMembershipModalOpen(false)}
              disabled={!selectedMembership}
              className="w-full sm:w-auto order-1 sm:order-2 h-9 text-sm"
            >
              Confirm Selection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddCustomerPage;
