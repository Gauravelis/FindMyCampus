"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createUser } from '@/lib/actions';
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  contact: z.string().min(10, { message: "Please enter a valid contact number." }).optional().or(z.literal("")),
});

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      contact: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await createUser({
        name: values.name,
        email: values.email,
        password: values.password,
        contact: values.contact || undefined,
      });
      toast({
          title: "Account Created!",
          description: "You have been successfully registered. Please log in.",
      });
      router.push('/login');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: 'Unable to create account. Try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm z-10 shadow-2xl bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
        <CardDescription>
          Fill in your details to get started.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 98765 43210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Create Account
            </Button>
            <p className="text-sm text-center">
                Already have an account?{' '}
                <Button variant="link" asChild className="p-0 h-auto">
                    <Link href="/login">Sign In</Link>
                </Button>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
