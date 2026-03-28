'use client';

import type { College } from '@/lib/types';
import HeroSection from '@/components/college-details/HeroSection';
import ContactCard from '@/components/college-details/ContactCard';
import DetailsTabs from '@/components/college-details/DetailsTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface CollegeDetailsClientProps {
    college: College;
}

export default function CollegeDetailsClient({ college }: CollegeDetailsClientProps) {
    const galleryImages = college.galleryImageUrls.map(url => {
        const placeholder = PlaceHolderImages.find(p => p.imageUrl === url);
        return {
        imageUrl: url,
        description: placeholder?.description || college.name,
        imageHint: placeholder?.imageHint || 'college gallery'
        }
    }).filter(Boolean);

    return (
        <>
        <div className="bg-muted/40">
            <HeroSection
            collegeId={college.id}
            name={college.name}
            city={college.city}
            state={college.state}
            imageUrl={college.heroImageUrl}
            />
            <div className="container mx-auto py-12 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                <DetailsTabs college={college} />
                {galleryImages.length > 0 && (
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Gallery</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {galleryImages.map((img, index) => (
                                    <div
                                        key={index}
                                        className="relative aspect-video rounded-lg overflow-hidden group"
                                        >
                                        <Image
                                            src={img!.imageUrl}
                                            alt={img!.description}
                                            data-ai-hint={img!.imageHint}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
                </div>
                <div className="lg:col-span-1">
                <ContactCard college={college} />
                </div>
            </div>
            </div>
        </div>
        </>
    );
}
