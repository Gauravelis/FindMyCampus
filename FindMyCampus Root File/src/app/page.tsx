import Image from "next/image";
import { getColleges, getUniqueStates, getUniqueCities } from "@/lib/data";
import CollegeList from "@/components/colleges/CollegeList";
import FilterPanel from "@/components/colleges/FilterPanel";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Chatbot from "@/components/Chatbot";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    state?: string;
    city?: string;
    minFees?: string;
    maxFees?: string;
    cutoff?: string;
  }>;
}) {
  // ✅ REQUIRED in Next.js 15
  const params = await searchParams;

  const colleges = await getColleges({
    query: params?.query,
    state: params?.state,
    city: params?.city,
    minFees: params?.minFees ? Number(params.minFees) : undefined,
    maxFees: params?.maxFees ? Number(params.maxFees) : undefined,
    cutoff: params?.cutoff ? Number(params.cutoff) : undefined,
  });

  const states = await getUniqueStates();
  const cities = await getUniqueCities();
  const heroImage = PlaceHolderImages.find((p) => p.id === "home-hero");

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-96 text-white">
        <div className="absolute inset-0 bg-black/50 z-10" />

        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
          />
        )}

        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            Find Your Future Campus
          </h1>
          <p className="mt-4 text-lg max-w-3xl">
            Explore thousands of colleges across India.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <FilterPanel states={states} cities={cities} />
          </aside>

          <div className="lg:col-span-3">
            <CollegeList colleges={colleges} searchParams={params} />
          </div>
        </div>
      </div>

      {/* ✅ CHATBOT */}
      <Chatbot />
    </div>
  );
}
