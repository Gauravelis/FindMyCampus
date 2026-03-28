import type { College } from '@/lib/types';
import CollegeCard from './CollegeCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

interface CollegeListProps {
  colleges: College[];
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function CollegeList({ colleges, searchParams }: CollegeListProps) {
  const hasFilters = searchParams && Object.keys(searchParams).length > 0;

  if (colleges.length === 0) {
    return (
       <Alert className="mt-8">
          <Frown className="h-4 w-4" />
          <AlertTitle>No Colleges Found</AlertTitle>
          <AlertDescription>
            Try adjusting your search or filter criteria. 
            <Button variant="link" asChild className="p-1 h-auto">
                <Link href="/">Clear filters</Link>
            </Button>
          </AlertDescription>
        </Alert>
    );
  }

  return (
    <div>
        {hasFilters && (
            <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Showing filtered results</AlertTitle>
                <AlertDescription>
                    {colleges.length} college{colleges.length > 1 ? 's' : ''} found. 
                    <Button variant="link" asChild className="p-1 h-auto">
                        <Link href="/">Clear all filters</Link>
                    </Button> to see all listings.
                </AlertDescription>
            </Alert>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {colleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
        ))}
        </div>
    </div>
  );
}
