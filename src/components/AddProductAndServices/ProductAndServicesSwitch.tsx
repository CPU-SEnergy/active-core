"use client";

import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { updateIsActiveStatus } from "@/app/actions/admin/products-services/UpdateIsActiveStatus";
import { mutate } from "swr";
import fetcher from "@/lib/fetcher";

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

      if (result.success) {
        mutate(`/api/${collectionName}`);
        mutate(`/api/${collectionName}/${id}`);

        window.location.reload();
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
