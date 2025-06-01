/* eslint-disable @typescript-eslint/no-explicit-any */

export function convertTimestampToDate(ts: any): Date {
  if (ts && typeof ts === "object" && ts._seconds) {
    return new Date(ts._seconds * 1000);
  }
  return new Date(ts);
}

export function formatDOB(dob: any): string {
  if (dob instanceof Date) {
    return dob.toISOString().split("T")[0] ?? "";
  }
  if (dob && typeof dob === "object" && dob._seconds) {
    return new Date(dob._seconds * 1000).toISOString().split("T")[0] ?? "";
  }
  return "";
}
