"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, sendEmailVerification } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { app } from "@/lib/firebaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export default function FinishSignup() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  const router = useRouter();
  const auth = getAuth(app);
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          router.push("/profile");
        })
        .catch((error) => {
          setNotice(`An error occurred during sign-in: ${error.message}`);
        });
    } else {
      setNotice("Invalid email link.");
    }
    console.log(values)
  }

  const callSignInWithEmailLink = (e: React.FormEvent) => {
    e.preventDefault();


  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
}
