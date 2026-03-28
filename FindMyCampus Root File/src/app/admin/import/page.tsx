import ImportClient from "@/components/admin/ImportClient";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Import Colleges - Admin Dashboard',
};

export default function ImportPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold tracking-tight">
                    Import Colleges
                </h1>
                <p className="text-muted-foreground">
                    Bulk upload college data from a CSV file.
                </p>
            </div>
            <ImportClient />
        </div>
    );
}
