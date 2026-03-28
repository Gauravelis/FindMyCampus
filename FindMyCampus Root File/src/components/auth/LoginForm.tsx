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
import { Loader2, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Update the import to use the new server action we created
import { loginUser } from '@/lib/actions';

const formSchema = z.object({
  username: z.string().min(1, { message: "Please enter your username." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      // Admin bypass check 
      if (values.username === "admin" && values.password === "root") {
          toast({
              title: "Admin Login Successful",
              description: "Redirecting to dashboard...",
          });
          localStorage.setItem('isAuthenticated', 'admin');
          localStorage.setItem('username', 'Admin');
          router.push('/admin');
          router.refresh();
          return;
      }

      // Check credentials against MySQL
      const response = await loginUser(values.username, values.password);

      // Check response.success explicitly
      if (response.success && response.user) {
        toast({
            title: "Login Successful",
            description: "Welcome back!",
        });
        localStorage.setItem('isAuthenticated', 'user');
        localStorage.setItem('username', response.user.name);
        router.push('/');
        router.refresh();
      } else {
        // If success is false, show the error
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: response.error || 'Username or password is incorrect.',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Login Error',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Card className="w-full max-w-sm z-10 shadow-2xl bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="your_username" {...field} />
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
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Sign In
            </Button>
            <p className="text-sm text-center text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Button variant="link" asChild className="p-0 h-auto">
                    <Link href="/signup">Create one</Link>
                </Button>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}