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

    if (!process.env.ALLOWED_EMAIL) {
      console.warn(
        "⚠️  ALLOWED_EMAIL environment variable is not set - no users will be granted admin privileges"
      );
      return {
        success: true,
        isAdmin: false,
        message: "No admin emails configured",
      };
    }

    const envValue = process.env.ALLOWED_EMAIL.trim();

    if (!envValue) {
      console.warn(
        "⚠️  ALLOWED_EMAIL environment variable is empty - no users will be granted admin privileges"
      );
      return {
        success: true,
        isAdmin: false,
        message: "Admin emails list is empty",
      };
    }

    console.log("Raw ALLOWED_EMAIL value:", envValue);

    try {
      if (envValue.startsWith("[") && envValue.endsWith("]")) {
        allowedEmails = JSON.parse(envValue);
        console.log("Parsed as JSON array:", allowedEmails);

        if (allowedEmails.length === 0) {
          console.warn(
            "⚠️  ALLOWED_EMAIL array is empty - no users will be granted admin privileges"
          );
          return {
            success: true,
            isAdmin: false,
            message: "Admin emails array is empty",
          };
        }
      } else {
        allowedEmails = envValue
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email.length > 0);
        console.log("Parsed as comma-separated:", allowedEmails);

        if (allowedEmails.length === 0) {
          console.warn(
            "⚠️  ALLOWED_EMAIL contains no valid emails - no users will be granted admin privileges"
          );
          return {
            success: true,
            isAdmin: false,
            message: "No valid admin emails found",
          };
        }
      }
    } catch (parseError) {
      console.error("Error parsing ALLOWED_EMAIL:", parseError);
      console.warn(
        "⚠️  Failed to parse ALLOWED_EMAIL - no users will be granted admin privileges"
      );
      return {
        success: true,
        isAdmin: false,
        message: "Failed to parse admin emails configuration",
      };
    }

    console.log("Final allowed emails array:", allowedEmails);
    console.log("Checking if user email is in allowed list:", email);

    if (allowedEmails.includes(email)) {
      console.log("✅ User is in allowed list, setting admin role");
      await setCustomUserClaims(userId, {
        role: "admin",
      });
      console.log("✅ Admin role set successfully");
      return { success: true, isAdmin: true, message: "Admin role assigned" };
    } else {
      console.log("ℹ️  User is not in allowed list, no admin role assigned");
      return {
        success: true,
        isAdmin: false,
        message: "User not in admin list",
      };
    }
  } catch (error) {
    console.error("Error checking/assigning admin role:", error);
    return { success: false, error: "Failed to check admin role" };
  }
};
