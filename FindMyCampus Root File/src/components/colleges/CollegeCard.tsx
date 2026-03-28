import Image from 'next/image';
import Link from 'next/link';
import type { College } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, BookOpen } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface CollegeCardProps {
  college: College;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const imagePlaceholder = PlaceHolderImages.find(img => img.imageUrl === college.heroImageUrl);

  return (
    <Link href={`/colleges/${college.id}`} className="group">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={college.heroImageUrl}
              alt={`Campus of ${college.name}`}
              data-ai-hint={imagePlaceholder?.imageHint || 'university campus'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <CardTitle className="text-lg font-headline font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
            {college.name}
          </CardTitle>
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1.5" />
            {college.city}, {college.state}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {college.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <div className="flex items-center text-sm text-foreground">
                <BookOpen className="h-4 w-4 mr-1.5 text-primary"/>
                <span className="font-semibold">{college.courses.length} Courses</span>
            </div>
            <Badge variant="secondary">
                {college.fees.toLocaleString('en-IN')}/yr
            </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
