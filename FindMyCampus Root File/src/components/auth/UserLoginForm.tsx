"use client";

import { useState, useEffect } from "react";
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
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

const formSchema = z.object({
  username: z.string().min(1, { message: "Please enter your username." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function UserLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Mocking auth logic
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (values.username === "admin" && values.password === "root") {
        toast({
            title: "Admin Login Successful",
            description: "Redirecting to dashboard...",
        });
        localStorage.setItem('isAuthenticated', 'admin');
        localStorage.setItem('username', 'Admin');
        router.push('/admin');
        router.refresh(); 
    } else {
        toast({
            title: "Login Successful",
            description: "Welcome back!",
        });
        localStorage.setItem('isAuthenticated', 'user');
        localStorage.setItem('username', values.username);
        router.push('/');
        router.refresh();
    }
  }
  
  if (!isClient) {
    return (
        <Card className="w-full z-10 shadow-2xl bg-card/90 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Welcome</CardTitle>
                <CardDescription>
                Login to your account to continue.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4">
                 <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    );
  }


  return (
    <Card className="w-full z-10 shadow-2xl bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Welcome</CardTitle>
        <CardDescription>
          Login to your account to continue.
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
          <CardFooter className="flex-col items-stretch gap-4">
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
