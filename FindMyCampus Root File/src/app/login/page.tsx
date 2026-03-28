import Image from "next/image";
import UserLoginForm from "@/components/auth/UserLoginForm";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - FindMyCampus',
};

export default function LoginPage() {
  const bgImage = PlaceHolderImages.find(p => p.id === 'login-bg');

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          data-ai-hint={bgImage.imageHint}
          fill
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
        <Link href="/" className="flex flex-col items-center text-white mb-8">
            <GraduationCap className="h-16 w-16 text-white" />
            <h1 className="mt-4 text-4xl font-headline font-bold">FindMyCampus</h1>
            <p className="text-lg text-white/80">Welcome Back</p>
        </Link>
        <UserLoginForm />
      </div>
    </div>
  );
}
