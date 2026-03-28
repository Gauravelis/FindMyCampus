'use client';

import Image from 'next/image';
import { MapPin, GitCompareArrows, Check, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '../ui/button';
import { useCompare } from '@/hooks/use-compare';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  collegeId: string;
  name: string;
  city: string;
  state: string;
  imageUrl: string;
}

export default function HeroSection({ collegeId, name, city, state, imageUrl }: HeroSectionProps) {
  const router = useRouter();
  const imagePlaceholder = PlaceHolderImages.find(img => img.imageUrl === imageUrl);
  const { compareList, toggleCompare } = useCompare();
  const { favoritesList, toggleFavorite } = useFavorites();
  const isComparing = compareList.includes(collegeId);
  const isFavorite = favoritesList.includes(collegeId);

  const handleAddToCompare = () => {
    // Check if we're adding (not already in list)
    const isAdding = !isComparing;
    toggleCompare(collegeId);
    
    // Navigate to compare page if adding
    if (isAdding) {
      router.push('/compare');
    }
  };

  const handleAddToFavorites = () => {
    // Check if we're adding (not already in list)
    const isAdding = !isFavorite;
    toggleFavorite(collegeId);
    
    // Navigate to favorites page if adding
    if (isAdding) {
      router.push('/favorites');
    }
  };

  return (
    <section className="relative w-full h-[50vh] min-h-[400px]">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
      <Image
        src={imageUrl}
        alt={`Hero image for ${name}`}
        data-ai-hint={imagePlaceholder?.imageHint || 'university campus'}
        fill
        className="object-cover"
        priority
      />
      <div className="relative z-20 flex flex-col items-start justify-end h-full text-white p-4 md:p-8">
        <div className="container mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl md:text-5xl font-headline font-bold tracking-tight">
                        {name}
                    </h1>
                    <div className="flex items-center text-base md:text-lg mt-2">
                        <MapPin className="h-5 w-5 mr-2" />
                        {city}, {state}
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <Button 
                        variant={isFavorite ? "secondary" : "outline"}
                        size="lg" 
                        className="bg-black/50 border-white/50 text-white hover:bg-white hover:text-black gap-2"
                        onClick={handleAddToFavorites}
                    >
                        <Heart className={cn("h-5 w-5", isFavorite && "fill-current text-red-500")} />
                        {isFavorite ? 'Favorited' : 'Favorite'}
                    </Button>
                    <Button 
                        variant={isComparing ? "secondary" : "outline"}
                        size="lg" 
                        className="bg-black/50 border-white/50 text-white hover:bg-white hover:text-black gap-2"
                        onClick={handleAddToCompare}
                    >
                        {isComparing ? <Check className="h-5 w-5"/> : <GitCompareArrows className="h-5 w-5" />}
                        {isComparing ? 'Added to Compare' : 'Compare College'}
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
