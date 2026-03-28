import { getCollegeById } from '@/lib/data';
import { notFound } from 'next/navigation';
import CollegeDetailsClient from '@/components/college-details/CollegeDetailsClient';
import type { Metadata } from 'next';

interface CollegePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: CollegePageProps): Promise<Metadata> {
  const college = await getCollegeById(params.id);
  if (!college) {
    return {
      title: 'College Not Found',
    };
  }
  return {
    title: `${college.name} - FindMyCampus`,
    description: college.description,
  };
}


export default async function CollegePage({ params }: CollegePageProps) {
  const college = await getCollegeById(params.id);

  if (!college) {
    notFound();
  }

  return <CollegeDetailsClient college={college} />;
}
