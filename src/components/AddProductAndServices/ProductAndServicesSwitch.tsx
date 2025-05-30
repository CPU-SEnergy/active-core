"use client";

import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { updateIsActiveStatus } from "@/app/actions/admin/products-services/UpdateIsActiveStatus";
import { mutate } from "swr";

interface UpdateMembershipPlanSwitchProps {
  collectionName: AllowedCollections;
  id: string;
  isActive: boolean;
}

export default function ProductAndServicesSwitch({
  collectionName,
  id,
  isActive,
}: UpdateMembershipPlanSwitchProps) {
  const [pending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      const result = await updateIsActiveStatus(collectionName, id, checked);
      mutate(`/api/${collectionName}`);

      if (result.success) {
        console.log("RESUUUUUUUULT" + result.success);
      } else {
        console.error(result.error ?? "Failed to update status");
      }
    });
  };

  return (
    <Switch
      checked={isActive}
      onCheckedChange={handleToggle}
      disabled={pending}
    />
  );
}
