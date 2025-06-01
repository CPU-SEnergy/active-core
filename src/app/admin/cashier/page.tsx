"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import UserSearch from "@/components/UserSearch";
import { Skeleton } from "@/components/ui/skeleton";

function CashierTableSkeleton() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={5} className="bg-white py-4">
                <Skeleton className="h-6 w-48" />
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="w-[300px]">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-20" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

type Cashier = {
  id: string;
  name: string;
  time: number;
};

type UserDetails = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CashierManagement() {
  // Fetch recent cashiers
  const { data, error, isLoading } = useSWR<
    { uid: string; name?: string; createdAt?: { seconds: number } }[]
  >("/api/admin/add-cashier/recently-added", fetcher, {
    dedupingInterval: 60000,
  });

  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const cashiers: Cashier[] = data
    ? data.map((c) => ({
        id: c.uid,
        name: c.name || "Unknown",
        time: c.createdAt?.seconds ? c.createdAt.seconds * 1000 : Date.now(),
      }))
    : [];

  const cashierIds = cashiers.map((c) => c.id).join(",");
  const { data: usersData } = useSWR<UserDetails[]>(
    cashierIds ? `/api/users?ids=${cashierIds}` : null,
    fetcher
  );

  const usersMap = usersData
    ? usersData.reduce(
        (acc, user) => {
          acc[user.id] = user;
          return acc;
        },
        {} as Record<string, UserDetails>
      )
    : {};
    
  const [selectedCashier, setSelectedCashier] = useState<{
    name: string;
    id: string;
    avatar?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  if (isLoading) {
      return <CashierTableSkeleton />;
    }


  const handleAddCashier = async () => {
    if (!selectedCashier) return;

    setLoading(true);
    setAddError(null);

    try {
      const res = await fetch("/api/admin/add-cashier/cashier-tagging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUid: selectedCashier.id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add cashier");
      }

      mutate(
        "/api/admin/add-cashier/recently-added",
        (currentData) => {
          if (!currentData)
            return [
              {
                uid: selectedCashier.id,
                name: selectedCashier.name,
                createdAt: { seconds: Math.floor(Date.now() / 1000) },
              },
            ];

          if (
            currentData.some(
              (c: { uid: string }) => c.uid === selectedCashier.id
            )
          )
            return currentData;

          return [
            ...currentData,
            {
              uid: selectedCashier.id,
              name: selectedCashier.name,
              createdAt: { seconds: Math.floor(Date.now() / 1000) },
            },
          ];
        },
        false
      );

      setSelectedCashier(null);
      setDialogOpen(false);
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    setRemoveError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/remove-cashier/cashier-removal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUid: id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to remove cashier");
      }

      // Optimistically update local cache
      const newCashiers = cashiers.filter((c) => c.id !== id);
      mutate(
        "/api/admin/add-cashier/recently-added",
        newCashiers.map((c) => ({
          uid: c.id,
          name: c.name,
          createdAt: { seconds: Math.floor(c.time / 1000) },
        })),
        false
      );
      setRemoveDialogOpen(false);
    } catch (err: unknown) {
      setRemoveError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveClick = (id: string) => {
    setConfirmRemoveId(id);
    setRemoveDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add Cashier</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800 text-white">
              Add Cashier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Select a user to promote to cashier</Label>
                <UserSearch onUserSelect={setSelectedCashier} />
              </div>
              {addError && <p className="text-red-600">{addError}</p>}
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCashier}
                disabled={!selectedCashier || loading}
                className="bg-black text-white"
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {removeError && (
        <p className="mb-4 text-red-600 text-center font-medium">
          {removeError}
        </p>
      )}

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={5} className="bg-white py-4">
                <h2 className="text-xl font-bold px-2 text-black">
                  Current Cashiers
                </h2>
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="w-[300px]">User</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-red-600">
                  Failed to load cashiers: {error.message}
                </TableCell>
              </TableRow>
            )}
            {cashiers.map((cashier) => {
              const user = usersMap[cashier.id];
              return (
                <TableRow key={cashier.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>
                          {user
                            ? user.firstName.charAt(0) + user.lastName.charAt(0)
                            : cashier.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>
                          {user
                            ? `${user.firstName} ${user.lastName}`
                            : cashier.name !== "Unknown"
                              ? cashier.name
                              : cashier.id}
                        </span>
                        {user && (
                          <span className="text-sm text-gray-500">
                            {user.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(cashier.time).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveClick(cashier.id)}
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {!isLoading && cashiers.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No cashiers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Cashier</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to remove this cashier?</p>
          <p className="text-sm text-gray-500">
            This action cannot be undone. The user will lose their cashier privileges.
          </p>
          {removeError && <p className="text-red-600">{removeError}</p>}
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setRemoveDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => confirmRemoveId && handleRemove(confirmRemoveId)}
            disabled={loading}
          >
            {loading ? "Removing..." : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  );
}
