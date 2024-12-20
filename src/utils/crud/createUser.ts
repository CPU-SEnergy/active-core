export const createUserInDatabase = async (userData: {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  sex: string;
}) => {
  const res: Response = await fetch("/api/create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error("An error occurred during sign-up.");
  }

  return res;
};
