/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db, type Schema } from "@/lib/schema/firestore";
import { updatePartialUserToAlgolia } from "./AddUserToAlgolia";

function validateAndFormatName(name: string, fieldName: string): string {
  if (!name || name.trim().length < 2) {
    throw new Error(`${fieldName} must be at least 2 characters`);
  }

  if (name.trim().length > 50) {
    throw new Error(`${fieldName} must be at most 50 characters`);
  }

  if (!/^[a-zA-Z\s\-']+$/.test(name.trim())) {
    throw new Error(
      `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
    );
  }

  return name
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function validateAndFormatPhone(phone: string): string {
  if (!phone) return "";

  const digitsOnly = phone.replace(/\D/g, "");

  if (!digitsOnly) return "";

  if (digitsOnly.length === 11 && digitsOnly.startsWith("09")) {
    return digitsOnly;
  }

  throw new Error("Phone number must be 11 digits starting with 09");
}

function validateDateOfBirth(dateString: string): Date | null {
  if (!dateString) return null;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  const today = new Date();
  const hundredYearsAgo = new Date(
    today.getFullYear() - 100,
    today.getMonth(),
    today.getDate()
  );
  const oneYearAgo = new Date(
    today.getFullYear() - 1,
    today.getMonth(),
    today.getDate()
  );

  if (date < hundredYearsAgo || date > oneYearAgo) {
    throw new Error("Age must be between 1 and 100 years");
  }

  if (date > today) {
    throw new Error("Date of birth cannot be in the future");
  }

  return date;
}

export async function updateUserProfile(formData: FormData) {
  try {
    getFirebaseAdminApp();

    if (!formData) {
      return { message: "Form data not received", status: 400 };
    }

    const currentUserId = formData.get("id") as Schema["users"]["Id"];
    if (!currentUserId || typeof currentUserId !== "string") {
      return { message: "Invalid user ID", status: 400 };
    }

    const rawFirstName = formData.get("firstName") as string;
    const rawLastName = formData.get("lastName") as string;
    const rawPhone = formData.get("phone") as string;
    const rawDob = formData.get("dob") as string;
    const rawSex = formData.get("sex") as string;

    let firstName: string;
    let lastName: string;
    let formattedPhone: string;
    let validatedDob: Date | null;
    let sex: string;

    try {
      firstName = validateAndFormatName(rawFirstName, "First name");
      lastName = validateAndFormatName(rawLastName, "Last name");
      formattedPhone = validateAndFormatPhone(rawPhone);
      validatedDob = validateDateOfBirth(rawDob);
      sex = rawSex || "";
    } catch (validationError) {
      return {
        message:
          validationError instanceof Error
            ? validationError.message
            : "Validation error",
        status: 400,
      };
    }

    const updatedData: any = {
      firstName,
      lastName,
      phone: formattedPhone,
    };

    if (validatedDob) {
      updatedData.dob = validatedDob;
    }

    if (sex) {
      updatedData.sex = sex;
    }

    await db.users.update(currentUserId, updatedData, { as: "server" });

    try {
      const algoliaResult = await updatePartialUserToAlgolia(currentUserId, {
        firstName,
        lastName,
      });

      if (algoliaResult.success) {
        console.log("User updated in Algolia successfully");
      } else {
        console.error("Failed to update user in Algolia:", algoliaResult.error);
      }
    } catch (algoliaError) {
      console.error("Failed to update user in Algolia:", algoliaError);
    }

    return {
      message: "Profile updated successfully!",
      status: 200,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      message: "Server error while updating profile",
      status: 500,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
