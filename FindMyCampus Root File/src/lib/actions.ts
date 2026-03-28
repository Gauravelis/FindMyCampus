'use server';

import { revalidatePath } from 'next/cache';
import type { College } from './types';
import { colleges, saveColleges, loadColleges, getCollegeById } from './data';
import { addUser, getUsers as serverGetUsers, deleteUser as deleteUserFromFile } from './users';

function generateId(name: string) {
    return name.toLowerCase().replace(/\s+/g, '-');
}

export async function createCollege(formData: Omit<College, 'id' | 'createdAt' | 'updatedAt'>) {
  await loadColleges();
  const newCollege: College = {
    id: generateId(formData.name),
    ...formData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  colleges.unshift(newCollege);
  await saveColleges(colleges);
  
  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath(`/colleges/${newCollege.id}`);

  return newCollege;
}

export async function updateCollege(id: string, formData: Omit<College, 'id' | 'createdAt' | 'updatedAt'>) {
  await loadColleges();
  const collegeIndex = colleges.findIndex((c) => c.id === id);

  if (collegeIndex === -1) {
    throw new Error('College not found');
  }

  const existingCollege = colleges[collegeIndex];

  const updatedCollege: College = {
    ...existingCollege,
    ...formData,
    id, // Ensure ID is not changed
    updatedAt: new Date(),
  };

  colleges[collegeIndex] = updatedCollege;
  await saveColleges(colleges);
  
  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath(`/colleges/${id}`);

  return updatedCollege;
}

export async function deleteCollege(id: string) {
  await loadColleges();
  const collegeIndex = colleges.findIndex((c) => c.id === id);

  if (collegeIndex === -1) {
    throw new Error('College not found');
  }

  colleges.splice(collegeIndex, 1);
  await saveColleges(colleges);
  
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function getCollegeByIdAction(id: string) {
    return getCollegeById(id);
}

// user-related actions
export async function createUser(data: {
    name: string;
    email: string;
    password?: string;
}) {
    const user = await addUser(data);
    revalidatePath('/admin');
    return user;
}

export async function getUsersAction() {
    return serverGetUsers();
}

export async function deleteUser(userId: string) {
    await deleteUserFromFile(userId);
    revalidatePath('/admin');
}
