"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";

export default function SelectProductAndServices() {
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname.split("/");
  const currentCategory = segments[segments.length - 1] || "";

  const handleSelect = (value: string) => {
    router.push(`/admin/add-products-and-services/${value}`);
  };

  return (
    <Select onValueChange={handleSelect} defaultValue={currentCategory}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apparels">Apparels</SelectItem>
        <SelectItem value="membership-plans">Membership</SelectItem>
        <SelectItem value="coaches">Coaches</SelectItem>
        <SelectItem value="classes">Classes</SelectItem>
      </SelectContent>
    </Select>
  );
}
