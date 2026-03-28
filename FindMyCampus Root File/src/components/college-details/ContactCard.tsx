'use client';

import type { College } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Mail, Phone, IndianRupee, MapPin, Map } from 'lucide-react';
import Link from 'next/link';

interface ContactCardProps {
  college: College;
}

export default function ContactCard({ college }: ContactCardProps) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${college.name}, ${college.address}`)}`;

  return (
    <Card className="sticky top-24 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Contact & Fees</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <span>{college.address}</span>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <Map className="w-4 h-4" />
              View on Map
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-primary" />
          <span className="font-semibold">Annual Fees:</span>
          <Badge variant="default" className="text-base ml-auto">
            {college.fees.toLocaleString('en-IN')}
          </Badge>
        </div>

        {college.website && (
          <Button asChild variant="outline" className="w-full justify-start gap-2">
            <Link href={college.website} target="_blank" rel="noopener noreferrer">
              <Globe className="w-4 h-4" />
              Visit Website
            </Link>
          </Button>
        )}
        {college.email && (
          <Button asChild variant="outline" className="w-full justify-start gap-2">
            <a href={`mailto:${college.email}`}>
              <Mail className="w-4 h-4" />
              {college.email}
            </a>
          </Button>
        )}
        {college.contactNumber && (
          <Button asChild variant="outline" className="w-full justify-start gap-2">
            <a href={`tel:${college.contactNumber}`}>
              <Phone className="w-4 h-4" />
              {college.contactNumber}
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
