"use client";

import Image from "next/image";
import { User, Clock, Calendar, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetUserById from "@/utils/helpers/getUserById";
import { Schema } from "@/lib/schema/firestore";
import {
  intlFormatDistance,
  differenceInYears,
  parseISO,
  format,
} from "date-fns";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserDashboardProps {
  uid: string;
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
  } = useSWR<UserHistoryProps[]>(
    `/api/user-membership-history/${uid}`,
    fetcher
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading user data</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black p-8 pt-20">
      {" "}
      {/* Changed text color to black */}
      <h1 className="text-4xl font-extrabold mb-8 text-black text-center">
        My Dashboard
      </h1>
      {/* Profile Card */}
      <Card className="mb-8 bg-white border border-gray-300 shadow-lg">
        <CardContent className="flex flex-col md:flex-row items-center p-6">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <Image
              src={"/pictures/chitomiguel.jpg"}
              alt="Profile Picture"
              width={120}
              height={120}
              className="rounded-full border-4 border-gray-300"
            />
          </div>
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome, {user.firstName}!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
              <div className="flex items-center">
                <User className="mr-2 text-gray-600" size={20} />
                <span>{user.firstName + " " + user.lastName}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 text-gray-600" size={20} />
                <span>
                  {user.dob
                    ? differenceInYears(
                        new Date(),
                        parseISO(user.dob.toString())
                      )
                    : ""}{" "}
                  years old
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 text-gray-600" size={20} />
                <span>
                  Joined:{" "}
                  {user.createdAt
                    ? intlFormatDistance(new Date(user.createdAt), new Date())
                    : "..."}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 text-gray-600" size={20} />
                {user.planExpiry ? (
                  <span>
                    Expires:{" "}
                    {format(new Date(user.planExpiry), "MMMM dd, yyyy")}
                  </span>
                ) : (
                  "No active membership"
                )}
              </div>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="mt-4 md:mt-0 md:ml-4 bg-gray-300 text-black hover:bg-gray-400"
                variant="outline"
              >
                <Edit2 className="mr-2" size={16} />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Update your personal information
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4 mr-8">
                  <Label htmlFor="name" className="text-right">
                    Name:
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mr-8">
                  <Label htmlFor="age" className="text-right">
                    Age:
                  </Label>
                  <Input id="age" placeholder="25" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      {/* Membership History Card */}
      <Card className="bg-white border border-gray-300 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 font-bold">
            Membership History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-gray-600">
              <thead>
                <tr className="border-b border-gray-300 text-black">
                  <th className="text-left p-3">Membership</th>
                  <th className="text-left p-3">Timeframe</th>
                  <th className="text-left p-3">Date Joined</th>
                  <th className="text-left p-3">Date Expired</th>
                </tr>
              </thead>
              <tbody>
                {isHistoryLoading && (
                  <tr>
                    <td colSpan={4} className="p-3 text-center">
                      Loading...
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={4} className="p-3 text-center text-red-500">
                      Error: {String(error)}
                    </td>
                  </tr>
                )}
                {history && history.length > 0 ? (
                  history.map((membership) =>
                    membership.error ? (
                      <tr key={membership.id}>
                        <td colSpan={4} className="p-3 text-center">
                          No membership history found.
                        </td>
                      </tr>
                    ) : (
                      <tr
                        key={membership.id}
                        className="border-b border-gray-300 last:border-b-0"
                      >
                        <td className="p-3">{membership.name}</td>
                        <td className="p-3">{membership.duration}</td>
                        <td className="p-3">
                          {new Date(membership.startDate).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          {new Date(membership.expiryDate).toLocaleDateString()}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={4} className="p-3 text-center">
                      No membership history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
