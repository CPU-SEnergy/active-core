"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { app } from "@/lib/firebaseClient";
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
  email: z.string().email("Invalid email address").min(1, "Email is required"),
})

export default function FinishSignup() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const router = useRouter();
  const auth = getAuth(app);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, values.email, window.location.href)
        .then(() => {
          router.push("/profile");
        })
        .catch(() => {
          // setNotice(`An error occurred during sign-in: ${error.message}`);
        });
    } else {
      // setNotice("Invalid email link.");
    }
    console.log(values)
  }

  return (
    <main className="w-full min-h-screen flex items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  We&apos;ll send you a link to finish signing up
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
