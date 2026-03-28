import CollegeForm from "@/components/admin/CollegeForm";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add New College - Admin Dashboard',
};

export default function NewCollegePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold tracking-tight">
                    Add a New College
                </h1>
                <p className="text-muted-foreground">
                    Fill in the details below to add a new college to the directory.
                </p>
            </div>
            <CollegeForm />
        </div>
    );
}
