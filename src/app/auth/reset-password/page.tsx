'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be more than 8 characters" })
})

interface ResetPasswordProps {
  token: string;
}

export default function ResetPassword({ searchParams }: { searchParams: ResetPasswordProps }) {
  const router = useRouter()
  const [message, setMessage] = useState('');
  const token = searchParams.token;

  console.log(token)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    const newPassword = values.password

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!res.ok) {
        throw new Error('Failed to reset password.');
      }

      const data = await res.json();
      setMessage(data.message || data.error);

      if (!data.error) {
        router.push('/auth/login');
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message || 'An error occurred. Please try again.');
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reset Password</FormLabel>
                <FormControl>
                  <Input placeholder="Reset password" type='password' {...field} />
                </FormControl>
                {/* <FormDescription>
                  This is your email address.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {message && <p>{message}</p>}
    </div>
  );
}
