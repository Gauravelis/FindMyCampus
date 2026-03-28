'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Heart, PlusCircle } from "lucide-react";
import { useFavorites } from '@/hooks/use-favorites';
import { getCollegeByIdAction } from '@/lib/actions';
import type { College } from '@/lib/types';
import CollegeCard from '@/components/colleges/CollegeCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function FavoritesPage() {
  const { favoritesList } = useFavorites();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchColleges() {
      setLoading(true);
      if (favoritesList.length > 0) {
        const fetchedColleges = await Promise.all(
          favoritesList.map(id => getCollegeByIdAction(id))
        );
        setColleges(fetchedColleges.filter((c): c is College => c !== undefined));
      } else {
        setColleges([]);
      }
      setLoading(false);
    }
    fetchColleges();
  }, [favoritesList]);
  
  const renderLoadingSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {Array.from({ length: Math.max(favoritesList.length, 1) }).map((_, i) => (
         <Card key={i} className="h-full flex flex-col overflow-hidden">
            <CardHeader className="p-0">
                <Skeleton className="h-48 w-full" />
            </CardHeader>
            <CardContent className="flex-grow p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardContent className="p-4 pt-0">
                <Skeleton className="h-6 w-1/2" />
            </CardContent>
        </Card>
      ))}
    </div>
  );


  const renderFavorites = () => {
    if (loading) {
        return renderLoadingSkeletons();
    }

    if (colleges.length === 0) {
        return (
             <div className="text-center h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-lg mt-8">
                <Heart className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Favorite Colleges Yet</h3>
                <p className="text-muted-foreground mb-4">
                Click the heart icon on a college to add it to your favorites.
                </p>
                <Button asChild>
                    <Link href="/">
                        <PlusCircle />
                        Browse Colleges
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {colleges.map(college => (
                <CollegeCard key={college.id} college={college} />
            ))}
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4">
            <div className="bg-primary text-primary-foreground rounded-lg h-16 w-16 flex items-center justify-center">
                <Heart className="h-8 w-8" />
            </div>
            <div>
                <h1 className="text-4xl font-headline font-bold">Favorite Colleges</h1>
                <p className="text-lg text-muted-foreground">
                Here are the colleges you've saved for later.
                </p>
            </div>
        </div>
        {renderFavorites()}
    </div>
  );
}
