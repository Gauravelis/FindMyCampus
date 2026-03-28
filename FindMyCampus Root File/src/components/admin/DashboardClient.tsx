'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import type { College, User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Loader2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteCollege, deleteUser } from '@/lib/actions';

interface DashboardClientProps {
  colleges: College[];
  users?: User[];
}

export default function DashboardClient({ colleges: initialColleges, users: initialUsers = [] }: DashboardClientProps) {
  const [filter, setFilter] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [colleges, setColleges] = useState(initialColleges);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [collegeToDelete, setCollegeToDelete] = useState<College | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteType, setDeleteType] = useState<'college' | 'user'>('college');
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    setColleges(initialColleges.filter((college) =>
      college.name.toLowerCase().includes(filter.toLowerCase())
    ));
  }, [filter, initialColleges]);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleEdit = (id: string) => {
    router.push(`/admin/colleges/edit/${id}`);
  };

  const openDeleteDialog = (college: College) => {
    setCollegeToDelete(college);
    setDeleteType('college');
    setIsDeleteDialogOpen(true);
  };

  const openDeleteUserDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteType('user');
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleteType === 'college' && !collegeToDelete) return;
    if (deleteType === 'user' && !userToDelete) return;
    
    startTransition(async () => {
      try {
        if (deleteType === 'college' && collegeToDelete) {
          await deleteCollege(collegeToDelete.id);
          toast({
            title: 'College Deleted',
            description: `${collegeToDelete.name} has been removed.`,
          });
          setCollegeToDelete(null);
        } else if (deleteType === 'user' && userToDelete) {
          await deleteUser(userToDelete.id);
          toast({
            title: 'User Deleted',
            description: `${userToDelete.name} has been removed.`,
          });
          setUserToDelete(null);
        }
        setIsDeleteDialogOpen(false);
        router.refresh();
      } catch (error) {
        toast({
          variant: "destructive",
          title: 'Error',
          description: `Failed to delete ${deleteType === 'college' ? collegeToDelete?.name : userToDelete?.name}.`,
        });
      }
    });
  };

  if (!isClient) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">
                    College Listings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-96 w-full animate-pulse bg-muted rounded-md" />
            </CardContent>
        </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <CardTitle className="font-headline text-2xl">
              College Listings
            </CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Filter colleges..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full md:w-64"
            />
            <Button asChild>
              <Link href="/admin/colleges/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add College
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Fees (p.a.)</TableHead>
                  <TableHead className="text-center">Courses</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {colleges.length > 0 ? (
                  colleges.map((college) => (
                    <TableRow key={college.id}>
                      <TableCell className="font-medium">{college.name}</TableCell>
                      <TableCell>
                        {college.city}, {college.state}
                      </TableCell>
                      <TableCell className="text-right">
                        {college.fees.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{college.courses.length}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(college.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(college)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center"
                    >
                      No colleges found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* user accounts list */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            User Accounts ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{(u as any).contact || 'N/A'}</TableCell>
                      <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="text-destructive" onClick={() => openDeleteUserDialog(u)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No user accounts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteType === 'college' 
                ? <>This action cannot be undone. This will permanently delete the college <span className="font-semibold">{collegeToDelete?.name}</span>.</>
                : <>This action cannot be undone. This will permanently delete the user account <span className="font-semibold">{userToDelete?.name}</span>.</>
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
