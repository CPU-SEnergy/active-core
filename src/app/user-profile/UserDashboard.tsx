"use client";
import { Clock, Calendar, Mail, Edit, Phone, UserIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetUserById from "@/utils/helpers/getUserById";
import type { Schema } from "@/lib/schema/firestore";
import { differenceInYears, parseISO, format, isAfter } from "date-fns";
import useSWR from "swr";
import EditUserProfileModal from "./EditUserProfileModal";
import Footer from "@/components/Footer";

interface UserDashboardProps {
  uid: string;
}

interface UserHistoryProps {
  id: string;
  name: string;
  duration: number;
  startDate: string;
  expiryDate: string;
  amount: number;
  paymentMethod: string;
  isWalkIn: boolean;
  createdAt: string | null;
  paymentReference: string;
}

interface ApiResponse {
  data: UserHistoryProps[];
  error?: string;
}

// Function to format duration dynamically
const formatDuration = (days: number): string => {
  if (days < 1) {
    const hours = Math.round(days * 24);
    if (hours < 1) {
      const minutes = Math.round(days * 24 * 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
    }
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  } else if (days < 30) {
    return `${days} ${days === 1 ? "day" : "days"}`;
  } else if (days < 365) {
    const months = Math.round(days / 30);
    return `${months} ${months === 1 ? "month" : "months"}`;
  } else {
    const years = Math.round(days / 365);
    return `${years} ${years === 1 ? "year" : "years"}`;
  }
};

// Function to format Philippine peso
const formatPeso = (amount: number): string => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};

// Fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch membership history");
    }
    return res.json();
  });

export default function UserDashboard({ uid }: UserDashboardProps) {
  const {
    user,
    isLoading,
    isError,
  }: { user: Schema["users"]["Data"]; isError: unknown; isLoading: boolean } =
    useGetUserById(uid);

  const {
    data: historyResponse,
    isLoading: isHistoryLoading,
    error: historyError,
  } = useSWR<ApiResponse>(`/api/user-membership-history/${uid}`, fetcher);

  // Extract the history array from the response
  const history = historyResponse?.data || [];
  const hasHistoryError = historyError || historyResponse?.error;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-full inline-flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Error Loading User Data</h3>
              <p className="text-muted-foreground">
                There was a problem retrieving your information. Please try
                again later.
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isActiveMembership =
    user.planExpiry && isAfter(new Date(user.planExpiry), new Date());
  const sexDisplay = user.sex
    ? user.sex.charAt(0).toUpperCase() + user.sex.slice(1).replace("-", " ")
    : "Not specified";

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-6 pt-20 md:pt-24 pb-24 md:pb-16">
        <div className="max-w-7xl mx-auto w-full flex flex-col space-y-4">
          {/* Header */}
          <div className="flex justify-center items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
              My Dashboard
            </h1>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
            {/* Profile Card */}
            <Card className="lg:col-span-1 border-none shadow-md bg-white dark:bg-slate-800 flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Profile
                  </CardTitle>
                  <EditUserProfileModal userData={user}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </EditUserProfileModal>
                </div>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 flex flex-col items-center flex-1">
                <div className="flex justify-center w-full mb-4">
                  <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-700 shadow-lg">
                    <AvatarImage
                      src="/pictures/chitomiguel.jpg"
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback className="text-2xl bg-slate-200 dark:bg-slate-700">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                  {user.firstName} {user.lastName}
                </h2>

                <p className="text-slate-500 dark:text-slate-400 mb-3 text-sm">
                  Member since{" "}
                  {user.createdAt
                    ? format(new Date(user.createdAt), "MMMM yyyy")
                    : "..."}
                </p>

                {isActiveMembership && (
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 mb-3">
                    Active Member
                  </Badge>
                )}

                <div className="w-full space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <span>
                      {user.dob
                        ? `${differenceInYears(new Date(), parseISO(user.dob.toString()))} years old`
                        : "Age not specified"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <UserIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <span>{sexDisplay}</span>
                  </div>

                  {user.email && (
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}

                  {user.phone && (
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <Phone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <span className="truncate">{user.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-200 dark:border-slate-700 pt-4 flex flex-col items-stretch">
                {user.planExpiry ? (
                  <div className="w-full">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Membership Status
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">
                        {isActiveMembership ? "Active until:" : "Expired on:"}
                      </span>
                      <span
                        className={`font-semibold text-sm ${isActiveMembership ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}
                      >
                        {format(new Date(user.planExpiry), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Membership Status
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">Status:</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-300 text-sm">
                        No active membership
                      </span>
                    </div>
                  </div>
                )}
              </CardFooter>
            </Card>

            {/* Membership History */}
            <Card className="lg:col-span-2 border-none shadow-md bg-white dark:bg-slate-800 flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Membership History
                </CardTitle>
                <CardDescription>
                  Your past and current memberships
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                {isHistoryLoading ? (
                  <div className="space-y-4">
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      ))}
                  </div>
                ) : hasHistoryError ? (
                  <div className="text-center py-8">
                    <div className="bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-full inline-flex mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Error Loading History
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      {historyResponse?.error || String(historyError)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </div>
                ) : history && history.length > 0 ? (
                  <div className="h-full flex flex-col">
                    <Tabs
                      defaultValue="table"
                      className="w-full flex flex-col h-full"
                    >
                      <TabsList className="mb-3">
                        <TabsTrigger value="table">Table View</TabsTrigger>
                        <TabsTrigger value="cards">Card View</TabsTrigger>
                      </TabsList>

                      <TabsContent
                        value="table"
                        className="flex-1 overflow-auto"
                      >
                        <div className="border rounded-md overflow-auto max-h-[400px] md:max-h-[500px]">
                          <table className="w-full border-collapse">
                            <thead className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                              <tr className="text-slate-700 dark:text-slate-300 text-left">
                                <th className="py-2 px-3 font-medium text-xs">
                                  Membership
                                </th>
                                <th className="py-2 px-3 font-medium text-xs">
                                  Duration
                                </th>
                                <th className="py-2 px-3 font-medium text-xs">
                                  Amount
                                </th>
                                <th className="py-2 px-3 font-medium text-xs">
                                  Payment
                                </th>
                                <th className="py-2 px-3 font-medium text-xs">
                                  Reference #
                                </th>
                                <th className="py-2 px-3 font-medium text-xs">
                                  Start Date
                                </th>
                                <th className="py-2 px-3 font-medium text-xs">
                                  Expiry Date
                                </th>
                                <th className="py-2 px-3 font-medium text-xs">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {history.map((membership) => {
                                const isActive = isAfter(
                                  new Date(membership.expiryDate),
                                  new Date()
                                );

                                return (
                                  <tr
                                    key={membership.id}
                                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                                  >
                                    <td className="py-2 px-3 font-medium text-xs">
                                      <div className="flex items-center gap-1">
                                        <span className="truncate">
                                          {membership.name}
                                        </span>
                                        {membership.isWalkIn && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            Walk-in
                                          </Badge>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400 text-xs">
                                      {formatDuration(membership.duration)}
                                    </td>
                                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400 font-medium text-xs">
                                      {formatPeso(membership.amount)}
                                    </td>
                                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400 capitalize text-xs">
                                      {membership.paymentMethod}
                                    </td>
                                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400 text-xs">
                                      <span className="font-mono">
                                        {membership.paymentReference}
                                      </span>
                                    </td>
                                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400 text-xs">
                                      {format(
                                        new Date(membership.startDate),
                                        "MMM dd, yyyy"
                                      )}
                                    </td>
                                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400 text-xs">
                                      {format(
                                        new Date(membership.expiryDate),
                                        "MMM dd, yyyy"
                                      )}
                                    </td>
                                    <td className="py-2 px-3">
                                      <Badge
                                        variant={
                                          isActive ? "default" : "outline"
                                        }
                                        className={`text-xs ${isActive ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
                                      >
                                        {isActive ? "Active" : "Expired"}
                                      </Badge>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>

                      <TabsContent
                        value="cards"
                        className="flex-1 overflow-auto"
                      >
                        <div className="overflow-auto max-h-[400px] md:max-h-[500px] pr-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {history.map((membership) => {
                              const isActive = isAfter(
                                new Date(membership.expiryDate),
                                new Date()
                              );

                              return (
                                <Card
                                  key={membership.id}
                                  className={`border ${isActive ? "border-emerald-200 dark:border-emerald-900" : "border-slate-200 dark:border-slate-700"}`}
                                >
                                  <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                      <CardTitle className="text-sm">
                                        {membership.name}
                                      </CardTitle>
                                      <Badge
                                        variant={
                                          isActive ? "default" : "outline"
                                        }
                                        className={`text-xs ${isActive ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
                                      >
                                        {isActive ? "Active" : "Expired"}
                                      </Badge>
                                    </div>
                                    <CardDescription className="text-xs">
                                      {formatDuration(membership.duration)} -{" "}
                                      {formatPeso(membership.amount)}
                                      {membership.isWalkIn && (
                                        <span className="ml-2">
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            Walk-in
                                          </Badge>
                                        </span>
                                      )}
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="pt-0">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div>
                                        <p className="text-slate-500 dark:text-slate-400">
                                          Start Date
                                        </p>
                                        <p className="font-medium">
                                          {format(
                                            new Date(membership.startDate),
                                            "MMM dd, yyyy"
                                          )}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-slate-500 dark:text-slate-400">
                                          Expiry Date
                                        </p>
                                        <p className="font-medium">
                                          {format(
                                            new Date(membership.expiryDate),
                                            "MMM dd, yyyy"
                                          )}
                                        </p>
                                      </div>
                                      <div className="mt-1">
                                        <p className="text-slate-500 dark:text-slate-400">
                                          Payment Method
                                        </p>
                                        <p className="font-medium capitalize">
                                          {membership.paymentMethod}
                                        </p>
                                      </div>
                                      <div className="mt-1">
                                        <p className="text-slate-500 dark:text-slate-400">
                                          Reference #
                                        </p>
                                        <p className="font-medium font-mono text-xs">
                                          {membership.paymentReference}
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full inline-flex mb-4">
                      <Calendar className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">
                      No Membership History
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      You don&apos;t have any membership records yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex-1 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-6 pt-16 md:pt-20 pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto w-full flex flex-col space-y-4">
        <div className="flex justify-center items-center">
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Profile Card Skeleton */}
          <Card className="lg:col-span-1 border-none shadow-md bg-white dark:bg-slate-800 flex flex-col">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent className="pt-2 flex flex-col items-center flex-1">
              <div className="flex justify-center w-full">
                <Skeleton className="h-24 w-24 rounded-full mb-4" />
              </div>
              <Skeleton className="h-6 w-48 mb-1" />
              <Skeleton className="h-4 w-32 mb-4" />

              <div className="w-full space-y-3">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>

          {/* Membership History Skeleton */}
          <Card className="lg:col-span-2 border-none shadow-md bg-white dark:bg-slate-800 flex flex-col">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>

              <div className="space-y-3">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 border border-slate-100 dark:border-slate-700 rounded-md"
                    >
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <div>
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
