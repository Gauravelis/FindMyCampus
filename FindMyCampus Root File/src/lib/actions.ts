'use server'

import pool from '@/lib/mysql'; 
import { getCollegeById, deleteCollege as deleteCollegeFromData, createCollege as createCollegeFromData, updateCollege as updateCollegeFromData } from '@/lib/data';
import { deleteUser as deleteUserFromUsers } from '@/lib/users';
import type { College } from '@/lib/types';

// Action for SignupForm.tsx
export async function createUser(userData: {
  name: string;
  email: string;
  password?: string;
  contact?: string; 
}): Promise<{ success: boolean; id?: number; error?: string }> {
  
  // FIXED: Extracted 'contact' from userData (with null as a fallback if empty)
  const { name, email, password = '', contact = null } = userData;
  
  try {
    // FIXED: Added 'contact' to the columns list and a 4th '?' to VALUES. 
    // Also added the 'contact' variable to the array at the end.
    const [result] = (await pool.query(
      'INSERT INTO users (name, email, password, contact) VALUES (?, ?, ?, ?)',
      [name, email, password, contact] 
    )) as any[];
    
    return { success: true, id: result.insertId };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to create user.' };
  }
}

// Action for LoginForm.tsx
export async function loginUser(username: string, password?: string): Promise<{
  success: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  error?: string;
}> {
  try {
    // We use password || '' so we never pass 'undefined' into the MySQL query
    const [rows] = (await pool.query(
      'SELECT * FROM users WHERE name = ? AND password = ?',
      [username, password || '']
    )) as any[];

    if (rows && rows.length > 0) {
      const user = rows[0];
      return { 
        success: true, 
        user: { id: user.id, name: user.name, email: user.email } 
      };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Database connection failed' };
  }
}

export async function getCollegeByIdAction(id: string): Promise<College | undefined> {
  return await getCollegeById(id);
}

export async function deleteCollege(id: string): Promise<void> {
  await deleteCollegeFromData(id);
}

export async function deleteUser(id: string): Promise<void> {
  await deleteUserFromUsers(id);
}

export async function createCollege(data: Omit<College, 'id' | 'createdAt' | 'updatedAt'>): Promise<College> {
  return await createCollegeFromData(data);
}

export async function updateCollege(id: string, data: Partial<Omit<College, 'id' | 'createdAt'>>): Promise<College> {
  return await updateCollegeFromData(id, data);
}