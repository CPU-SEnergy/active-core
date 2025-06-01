"use server";

import { getFirebaseAuth } from "next-firebase-auth-edge";
import { serverConfig } from "@/lib/config";

export const checkAndAssignAdminRole = async (
  userId: string,
  email: string
) => {
  console.log("Checking admin role for user:", email);

  const { setCustomUserClaims } = getFirebaseAuth({
    serviceAccount: serverConfig.serviceAccount,
    apiKey: serverConfig.apiKey,
  });

  try {
    let allowedEmails: string[] = [];

    if (process.env.ALLOWED_EMAIL) {
      const envValue = process.env.ALLOWED_EMAIL.trim();
      console.log("Raw ALLOWED_EMAIL value:", envValue);

      try {
        if (envValue.startsWith("[") && envValue.endsWith("]")) {
          allowedEmails = JSON.parse(envValue);
          console.log("Parsed as JSON array:", allowedEmails);
        } else {
          allowedEmails = envValue.split(",").map((email) => email.trim());
          console.log("Parsed as comma-separated:", allowedEmails);
        }
      } catch (parseError) {
        console.error("Error parsing ALLOWED_EMAIL:", parseError);
        allowedEmails = envValue.split(",").map((email) => email.trim());
        console.log("Fallback to comma-separated:", allowedEmails);
      }
    }

    console.log("Final allowed emails array:", allowedEmails);
    console.log("Checking if user email is in allowed list:", email);

    if (allowedEmails.includes(email)) {
      console.log("User is in allowed list, setting admin role");
      await setCustomUserClaims(userId, {
        role: "admin",
      });
      console.log("Admin role set successfully");
      return { success: true, isAdmin: true };
    } else {
      console.log("User is not in allowed list, no admin role assigned");
      return { success: true, isAdmin: false };
    }
  } catch (error) {
    console.error("Error checking/assigning admin role:", error);
    return { success: false, error: "Failed to check admin role" };
  }
};
