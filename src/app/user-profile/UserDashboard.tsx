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

interface UserDashboardProps {
  uid: string;
}

interface UserHistoryProps {
  id: string;
  name: string;
  duration: string;
  startDate: string;
  expiryDate: string;
  error?: boolean;
}

export default function UserDashboard({ uid }: UserDashboardProps) {
  const {
    user,
    isLoading,
    isError,
  }: { user: Schema["users"]["Data"]; isError: unknown; isLoading: boolean } =
    useGetUserById(uid);

  const {
    data: history,
    isLoading: isHistoryLoading,
    error,
  } = useSWR<UserHistoryProps[]>(`/api/user-membership-history/${uid}`);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-center items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">
            My Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1 border-none shadow-md bg-white dark:bg-slate-800">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
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
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="flex justify-center w-full mb-6">
                <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-700 shadow-lg">
                  <AvatarImage
                    src="/pictures/chitomiguel.jpg"
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <AvatarFallback className="text-3xl bg-slate-200 dark:bg-slate-700">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {user.firstName} {user.lastName}
              </h2>

              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Member since{" "}
                {user.createdAt
                  ? format(new Date(user.createdAt), "MMMM yyyy")
                  : "..."}
              </p>

              {isActiveMembership && (
                <Badge className="bg-emerald-500 hover:bg-emerald-600 mb-4">
                  Active Member
                </Badge>
              )}

              <div className="w-full space-y-4">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <Clock className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  <span>
                    {user.dob
                      ? `${differenceInYears(new Date(), parseISO(user.dob.toString()))} years old`
                      : "Age not specified"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <UserIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  <span>{sexDisplay}</span>
                </div>

                {user.email && (
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <Mail className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                )}

                {user.phone && (
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <Phone className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    <span className="truncate">{user.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-200 dark:border-slate-700 pt-6 flex flex-col items-stretch">
              {user.planExpiry ? (
                <div className="w-full">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    Membership Status
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {isActiveMembership ? "Active until:" : "Expired on:"}
                    </span>
                    <span
                      className={`font-semibold ${isActiveMembership ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}
                    >
                      {format(new Date(user.planExpiry), "MMMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    Membership Status
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Status:</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      No active membership
                    </span>
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>

          {/* Membership History */}
          <Card className="lg:col-span-2 border-none shadow-md bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Membership History
              </CardTitle>
              <CardDescription>
                Your past and current memberships
              </CardDescription>
            </CardHeader>
            <CardContent>
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
              ) : error ? (
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
                    {String(error)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              ) : history && history.length > 0 && !history[0]?.error ? (
                <div className="overflow-x-auto">
                  <Tabs defaultValue="table" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="table">Table View</TabsTrigger>
                      <TabsTrigger value="cards">Card View</TabsTrigger>
                    </TabsList>

                    <TabsContent value="table">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-left">
                            <th className="py-3 px-4 font-medium">
                              Membership
                            </th>
                            <th className="py-3 px-4 font-medium">Duration</th>
                            <th className="py-3 px-4 font-medium">
                              Start Date
                            </th>
                            <th className="py-3 px-4 font-medium">
                              Expiry Date
                            </th>
                            <th className="py-3 px-4 font-medium">Status</th>
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
                                <td className="py-3 px-4 font-medium">
                                  {membership.name}
                                </td>
                                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                                  {membership.duration}
                                </td>
                                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                                  {format(
                                    new Date(membership.startDate),
                                    "MMM dd, yyyy"
                                  )}
                                </td>
                                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                                  {format(
                                    new Date(membership.expiryDate),
                                    "MMM dd, yyyy"
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <Badge
                                    variant={isActive ? "default" : "outline"}
                                    className={
                                      isActive
                                        ? "bg-emerald-500 hover:bg-emerald-600"
                                        : ""
                                    }
                                  >
                                    {isActive ? "Active" : "Expired"}
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </TabsContent>

                    <TabsContent value="cards">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                  <CardTitle className="text-lg">
                                    {membership.name}
                                  </CardTitle>
                                  <Badge
                                    variant={isActive ? "default" : "outline"}
                                    className={
                                      isActive
                                        ? "bg-emerald-500 hover:bg-emerald-600"
                                        : ""
                                    }
                                  >
                                    {isActive ? "Active" : "Expired"}
                                  </Badge>
                                </div>
                                <CardDescription>
                                  {membership.duration}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="text-slate-500 dark:text-slate-400">
                                      Start Date
                                    </p>
                                    <p className="font-medium">
                                      {format(
                                        new Date(membership.startDate),
                                        "MMMM dd, yyyy"
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
                                        "MMMM dd, yyyy"
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full inline-flex mb-4">
                    <Calendar className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    No Membership History
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    You don't have any membership records yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-center items-center">
          <Skeleton className="h-10 w-48" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card Skeleton */}
          <Card className="lg:col-span-1 border-none shadow-md bg-white dark:bg-slate-800">
            <CardHeader className="pb-0">
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="flex justify-center w-full">
                <Skeleton className="h-32 w-32 rounded-full mb-6" />
              </div>
              <Skeleton className="h-8 w-48 mb-1" />
              <Skeleton className="h-4 w-32 mb-6" />

              <div className="w-full space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>

          {/* Membership History Skeleton */}
          <Card className="lg:col-span-2 border-none shadow-md bg-white dark:bg-slate-800">
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>

              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-4 border border-slate-100 dark:border-slate-700 rounded-md"
                    >
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div>
                          <Skeleton className="h-5 w-32 mb-2" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <div>
                        <Skeleton className="h-6 w-20" />
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
