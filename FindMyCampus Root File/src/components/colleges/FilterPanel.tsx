'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Search, X, Percent } from 'lucide-react';

interface FilterPanelProps {
  states: string[];
  cities: string[];
}

export default function FilterPanel({ states, cities }: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [feeRange, setFeeRange] = useState([
    Number(searchParams.get('minFees') || 0),
    Number(searchParams.get('maxFees') || 3000000)
  ]);
  const [cutoff, setCutoff] = useState(searchParams.get('cutoff') || '');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (query) params.set('query', query); else params.delete('query');
    if (selectedState) params.set('state', selectedState); else params.delete('state');
    if (selectedCity) params.set('city', selectedCity); else params.delete('city');
    if (cutoff) params.set('cutoff', cutoff); else params.delete('cutoff');
    params.set('minFees', feeRange[0].toString());
    params.set('maxFees', feeRange[1].toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  
  const clearFilters = () => {
      setQuery('');
      setSelectedState('');
      setSelectedCity('');
      setFeeRange([0, 3000000]);
      setCutoff('');
      router.push(pathname, { scroll: false });
  }
  
  if (!isClient) {
    return (
        <Card className="sticky top-24 shadow-lg">
            <CardHeader>
                 <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Search className="w-6 h-6"/>
                    Filter Colleges
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="h-64 w-full animate-pulse bg-muted rounded-md" />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="sticky top-24 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Search className="w-6 h-6"/>
            Filter & Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search">College Name</Label>
          <Input
            id="search"
            placeholder="e.g. IIT Delhi"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cutoff" className="flex items-center gap-2">
            <Percent className="w-4 h-4"/>
            My Percentage
          </Label>
          <Input
            id="cutoff"
            type="number"
            placeholder="e.g. 95"
            value={cutoff}
            onChange={(e) => setCutoff(e.target.value)}
            min="0"
            max="100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger id="state">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
           <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger id="city">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Annual Fees</Label>
          <Slider
            min={0}
            max={3000000}
            step={50000}
            value={[feeRange[0], feeRange[1]]}
            onValueChange={(value) => setFeeRange(value as [number, number])}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{feeRange[0].toLocaleString('en-IN')}</span>
            <span>{feeRange[1].toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={handleFilter}>Apply Filters</Button>
          <Button onClick={clearFilters} variant="outline"><X className="w-4 h-4 mr-2"/>Clear Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
}
