'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { College } from '@/lib/types';
import Icon from '@/components/Icon';
import Image from 'next/image';
import { Percent } from 'lucide-react';

interface DetailsTabsProps {
  college: College;
}

export default function DetailsTabs({ college }: DetailsTabsProps) {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <Tabs defaultValue="about">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="awards">Awards</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="mt-6">
            <h3 className="text-xl font-headline font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground prose prose-sm max-w-none">{college.description}</p>
            <h3 className="text-xl font-headline font-semibold mt-6 mb-2">Detailed Overview</h3>
            <p className="text-muted-foreground prose prose-sm max-w-none">{college.longDescription}</p>
          </TabsContent>
          <TabsContent value="courses" className="mt-6">
            <div className="space-y-3">
              {college.courses.map((course) => (
                <div key={course.name} className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                  <span className="font-medium">{course.name}</span>
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    <Percent className="h-4 w-4 mr-1.5" />
                    {course.cutoff}% Cutoff
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="facilities" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {college.facilities.map((facility) => (
                <div key={facility.name} className="flex flex-col items-center text-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Icon name={facility.icon as any} className="w-8 h-8 text-primary" />
                  <span className="text-sm font-medium">{facility.name}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="awards" className="mt-6 space-y-4">
            {college.awards.map((award) => {
              return (
                <div key={award.title} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  {award.imageUrl && (
                     <div
                        className="relative h-20 w-20 flex-shrink-0 group"
                      >
                       <Image
                          src={award.imageUrl}
                          alt={award.title}
                          data-ai-hint={'award'}
                          fill
                          className="rounded-md object-cover"
                        />
                     </div>
                  )}
                  <div>
                    <h4 className="font-semibold font-headline">{award.title}</h4>
                    <p className="text-sm text-muted-foreground">{award.description}</p>
                  </div>
                </div>
              )
            })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
