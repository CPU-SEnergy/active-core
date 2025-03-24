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
import { Check } from "lucide-react";

type Customer = {
  id: string;
  name: string;
  status: "New Customer" | "Signed up" | "Content";
  requestNumber: string;
  time: string;
  subscription: string;
};

type MembershipTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
};

const membershipTiers: MembershipTier[] = [
  {
    name: "Bronze",
    price: "$29.99/month",
    description: "Basic membership with essential features",
    features: [
      "Access to gym facilities",
      "Basic fitness assessment",
      "Online workout tracking",
    ],
  },
  {
    name: "Silver",
    price: "$49.99/month",
    description: "Enhanced membership with additional benefits",
    features: [
      "All Bronze features",
      "Group fitness classes",
      "Locker rental",
      "Towel service",
    ],
  },
  {
    name: "Gold",
    price: "$79.99/month",
    description: "Premium membership with exclusive perks",
    features: [
      "All Silver features",
      "1 personal training session/month",
      "Nutrition consultation",
      "Sauna & spa access",
    ],
  },
  {
    name: "Platinum",
    price: "$129.99/month",
    description: "Elite membership for serious fitness enthusiasts",
    features: [
      "All Gold features",
      "3 personal training sessions/month",
      "Priority class booking",
      "Guest passes (2/month)",
    ],
  },
  {
    name: "Diamond",
    price: "$199.99/month",
    description: "Ultimate all-inclusive membership experience",
    features: [
      "All Platinum features",
      "Unlimited personal training",
      "Exclusive events access",
      "Complimentary protein shakes",
      "Personalized fitness program",
    ],
  },
];

const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "Brian Scott",
    status: "New Customer",
    requestNumber: "#0000029",
    time: "1 min ago",
    subscription: "Bronze",
  },
  {
    id: "2",
    name: "Ryan Smith",
    status: "Signed up",
    requestNumber: "#0000028",
    time: "3 hrs ago",
    subscription: "Gold",
  },
  {
    id: "3",
    name: "Anthony White",
    status: "Signed up",
    requestNumber: "#0000027",
    time: "10 hrs ago",
    subscription: "Silver",
  },
  {
    id: "4",
    name: "Ashley Adams",
    status: "Content",
    requestNumber: "#0000026",
    time: "12 hrs ago",
    subscription: "Bronze",
  },
  {
    id: "5",
    name: "John Robinson",
    status: "Content",
    requestNumber: "#0000025",
    time: "15 hrs ago",
    subscription: "Platinum",
  },
];

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [date, setDate] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    membership: "",
  });
  const [selectedMembership, setSelectedMembership] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMembershipSelect = (membership: string) => {
    setSelectedMembership(membership);
    setFormData((prev) => ({ ...prev, membership }));
    setIsMembershipModalOpen(false);
  };

  const handleSubmit = () => {
    if (!formData.membership) {
      alert("Please select a membership plan");
      return;
    }

    const newCustomer: Customer = {
      id: (customers.length + 1).toString(),
      name: `${formData.firstName} ${formData.lastName}`,
      status: "New Customer",
      requestNumber: `#${String(30 + customers.length).padStart(7, "0")}`,
      time: "Just now",
      subscription: formData.membership,
    };
    setCustomers([newCustomer, ...customers]);
    setIsModalOpen(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      membership: "",
    });
    setSelectedMembership("");
    setDate("");
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
          <Button className="bg-zinc-900 hover:bg-zinc-700 text-sm px-3 py-2">
            Walk-in Customer
          </Button>
          <Button
            className="bg-zinc-900 hover:bg-zinc-700 text-sm px-3 py-2"
            onClick={() => setIsModalOpen(true)}
          >
            Add Customer
          </Button>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Recently added</h2>
        <div className="overflow-auto border rounded-md">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request #</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Subscription</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} className="text-sm">
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.status}</TableCell>
                  <TableCell>{customer.requestNumber}</TableCell>
                  <TableCell>{customer.time}</TableCell>
                  <TableCell>{customer.subscription}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Customer Add Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <Label>Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
            />
            <Label>Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="09*********"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <Label>Date of birth</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <div>
              <Label>Membership</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="membership"
                  name="membership"
                  value={selectedMembership}
                  placeholder="Select a membership plan"
                  readOnly
                  onClick={openMembershipModal}
                  className="cursor-pointer"
                />
                <Button type="button" onClick={openMembershipModal}>
                  Choose
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Membership Selection Modal */}
      <Dialog
        open={isMembershipModalOpen}
        onOpenChange={setIsMembershipModalOpen}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Membership Plan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {membershipTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`border-2 rounded-lg p-4 ${selectedMembership === tier.name ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-bold">{tier.name}</h3>
                    <p className="text-lg font-semibold">{tier.price}</p>
                  </div>
                  <div className="mb-4">
                    <p className="mb-4">{tier.description}</p>
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <Button
                      className="w-full"
                      onClick={() => handleMembershipSelect(tier.name)}
                      variant={
                        selectedMembership === tier.name ? "default" : "outline"
                      }
                    >
                      {selectedMembership === tier.name
                        ? "Selected"
                        : "Select Plan"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMembershipModalOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
