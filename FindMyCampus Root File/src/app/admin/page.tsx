import { getColleges } from '@/lib/data';
import { getUsers } from '@/lib/users';
import DashboardClient from '@/components/admin/DashboardClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - FindMyCampus',
};

export default async function AdminDashboardPage() {
  const colleges = await getColleges();
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Welcome, Admin!
        </h1>
        <p className="text-muted-foreground">
          Manage your college listings from here.
        </p>
      </div>
      <DashboardClient colleges={colleges} users={users} />
    </div>
  );
}
