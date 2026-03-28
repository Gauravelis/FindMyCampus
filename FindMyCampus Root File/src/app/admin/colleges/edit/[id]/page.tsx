import CollegeForm from "@/components/admin/CollegeForm";
import { getCollegeById } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

interface EditCollegePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EditCollegePageProps): Promise<Metadata> {
  const college = await getCollegeById(params.id);
  return {
    title: `Edit ${college?.name || 'College'} - Admin Dashboard`,
  };
}

export default async function EditCollegePage({ params }: EditCollegePageProps) {
    const college = await getCollegeById(params.id);

    if (!college) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold tracking-tight">
                    Edit College
                </h1>
                <p className="text-muted-foreground">
                    Update the details for <span className="font-semibold">{college.name}</span>.
                </p>
            </div>
            <CollegeForm college={college} />
        </div>
    );
}
