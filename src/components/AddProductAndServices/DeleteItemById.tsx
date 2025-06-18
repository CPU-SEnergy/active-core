"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { mutate } from "swr";
import fetcher from "@/lib/fetcher";

interface DeleteButtonProps {
  id: string;
  collectionName: AllowedCollections;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export default function DeleteButton({
  id,
  collectionName,
  onDelete,
}: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
  setError(null);
  setLoading(true);

  try {
    const result = await onDelete(id);

    if (result.success) {
      await mutate(`/api/${collectionName}`, () => fetcher(`/api/${collectionName}`));
      await mutate(`/api/${collectionName}/${id}`, () => fetcher(`/api/${collectionName}/${id}`));

      toast.success("Item deleted successfully");
      setDialogOpen(false);
    } else {
      throw new Error(result.error || "Failed to delete item");
    }
  } catch (error) {
    setError(error instanceof Error ? error.message : "Failed to delete item");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={() => setDialogOpen(true)}
        disabled={loading}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the item.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}