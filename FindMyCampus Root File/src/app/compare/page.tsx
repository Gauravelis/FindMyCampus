'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GitCompareArrows, PlusCircle, Trash2, Library, BookOpen, IndianRupee, MapPin, Percent } from "lucide-react";
import { useCompare } from '@/hooks/use-compare';
import { getCollegeByIdAction } from '@/lib/actions';
import type { College } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Icon from '@/components/Icon';
import { cn } from '@/lib/utils';

export default function ComparePage() {
  const { compareList, removeFromCompare } = useCompare();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchColleges() {
      setLoading(true);
      if (compareList.length > 0) {
        const fetchedColleges = await Promise.all(
          compareList.map(id => getCollegeByIdAction(id))
        );
        setColleges(fetchedColleges.filter((c): c is College => c !== undefined));
      } else {
        setColleges([]);
      }
      setLoading(false);
    }
    fetchColleges();
  }, [compareList]);

  const renderLoadingSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: Math.max(compareList.length, 1) }).map((_, i) => (
        <Card key={i}>
            <CardHeader className="p-0">
                <Skeleton className="h-48 w-full" />
            </CardHeader>
            <CardContent className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
            </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderComparison = () => {
    if (loading) {
      return renderLoadingSkeletons();
    }
    
    if (colleges.length === 0) {
        return (
            <div className="text-center h-64 flex flex-col items-center justify-center">
                <GitCompareArrows className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Comparison List is Empty</h3>
                <p className="text-muted-foreground mb-4">
                You haven't added any colleges to compare yet.
                </p>
                <Button asChild>
                    <Link href="/">
                        <PlusCircle />
                        Browse Colleges
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="w-full overflow-x-auto pb-4">
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${colleges.length}, minmax(300px, 1fr))` }}>
                {colleges.map(college => (
                    <Card key={college.id} className="flex flex-col">
                         <CardHeader className="p-0">
                            <div className="relative h-48 w-full">
                                <Image src={college.heroImageUrl} alt={college.name} fill className="object-cover" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 flex flex-col flex-grow">
                             <div>
                                <Link href={`/colleges/${college.id}`} className="hover:text-primary">
                                    <h3 className="font-bold font-headline text-xl">{college.name}</h3>
                                </Link>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <MapPin className="h-4 w-4 mr-1.5" />
                                    {college.city}, {college.state}
                                </div>
                                <div className="flex items-center font-semibold text-lg my-3">
                                    <IndianRupee className="h-5 w-5 mr-1.5 text-primary" />
                                     {college.fees.toLocaleString('en-IN')}
                                     <span className="text-sm font-normal text-muted-foreground ml-1">/ year</span>
                                </div>
                                <Separator className="mb-3"/>
                            </div>
                            <div className="flex-grow flex flex-col">
                                <h4 className="font-semibold mb-2 text-md flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-primary"/>
                                    Courses Offered
                                </h4>
                                <ul className="space-y-1 text-sm text-muted-foreground flex-grow">
                                    {college.courses.map(course => (
                                        <li key={course.name} className="flex justify-between">
                                            <span>{course.name}</span>
                                            <span className="font-semibold text-foreground flex items-center gap-1">
                                                <Percent className="h-3 w-3 text-primary"/>
                                                {course.cutoff}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                        <div className="p-4 border-t mt-auto">
                            <h4 className="font-semibold mb-2 text-md flex items-center gap-2">
                                <Library className="h-5 w-5 text-primary"/>
                                Facilities
                            </h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {college.facilities.map(facility => (
                                    <li key={facility.name} className="flex items-center gap-2">
                                        <Icon name={facility.icon as any} className="h-4 w-4 text-primary" />
                                        <span>{facility.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-4 border-t">
                            <Button variant="destructive" size="sm" className="w-full" onClick={() => removeFromCompare(college.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {colleges.length < 4 && (
                 <Card className="mt-8">
                    <CardContent className="p-6 text-center">
                        <h3 className="text-md font-semibold mb-1">Want to compare more?</h3>
                        <p className="text-muted-foreground text-sm mb-3">You can compare up to 4 colleges.</p>
                        <Button asChild variant="outline">
                            <Link href="/">
                                <PlusCircle/>
                                Browse More Colleges
                            </Link>
                        </Button>
                    </CardContent>
                 </Card>
            )}
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
             <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
                <GitCompareArrows className="h-8 w-8 text-primary" />
                Compare Colleges
            </h1>
            <p className="text-lg text-muted-foreground">
            A side-by-side comparison of your selected colleges.
            </p>
        </div>
        {renderComparison()}
    </div>
  );
}
