"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MembershipPlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: MembershipPlan | null;
}

interface MembershipPlan {
  id?: number;
  name: string;
  type: string;
  description: string;
  price: { regular: number; student: number; special: number };
  duration: string;
  status: string;
}

export function MembershipPlanForm({ isOpen, onClose, onSuccess, initialData }: MembershipPlanFormProps) {
  const [formData, setFormData] = useState<MembershipPlan>(
    initialData || {
      name: "",
      type: "Premium",
      description: "",
      price: { regular: 0, student: 0, special: 0 },
      duration: "1 Year",
      status: "Active",
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: keyof MembershipPlan, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (key: keyof MembershipPlan["price"], value: number) => {
    setFormData((prev) => ({ ...prev, price: { ...prev.price, [key]: value } }));
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", formData);
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Membership Plan" : "Add Membership Plan"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Label>Plan Name</Label>
          <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Enter plan name" />
          
          <Label>Type</Label>
          <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
            </SelectContent>
          </Select>
          
          <Label>Description</Label>
          <Input value={formData.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Enter description" />
          
          <Label>Regular Price</Label>
          <Input type="number" value={formData.price.regular} onChange={(e) => handlePriceChange("regular", Number(e.target.value))} />
          
          <Label>Student Price</Label>
          <Input type="number" value={formData.price.student} onChange={(e) => handlePriceChange("student", Number(e.target.value))} />
          
          <Label>Special Price</Label>
          <Input type="number" value={formData.price.special} onChange={(e) => handlePriceChange("special", Number(e.target.value))} />
          
          <Label>Duration</Label>
          <Select value={formData.duration} onValueChange={(value) => handleChange("duration", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1 Year">1 Year</SelectItem>
              <SelectItem value="6 Months">6 Months</SelectItem>
              <SelectItem value="3 Months">3 Months</SelectItem>
            </SelectContent>
          </Select>
          
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{initialData ? "Update" : "Add"} Plan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}