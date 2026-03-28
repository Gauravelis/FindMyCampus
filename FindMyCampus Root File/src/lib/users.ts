import fs from 'fs/promises';
import path from 'path';
import { User } from './types';

const usersFilePath = path.join(process.cwd(), 'src/lib/users.json');

// in-memory cache
export let users: User[] = [];

export async function loadUsers() {
    if (users.length > 0) {
        return;
    }
    try {
        const data = await fs.readFile(usersFilePath, 'utf-8');
        const json: any[] = JSON.parse(data);
        users = json.map(u => ({
            ...u,
            createdAt: new Date(u.createdAt),
        }));
    } catch (error) {
        users = [];
    }
}

export async function saveUsers(updatedUsers: User[]) {
    try {
        const data = JSON.stringify(updatedUsers, null, 2);
        await fs.writeFile(usersFilePath, data, 'utf-8');
        users = updatedUsers;
    } catch (error) {
        console.error('Failed to save users data:', error);
    }
}

export async function getUsers(): Promise<User[]> {
    await loadUsers();
    return JSON.parse(JSON.stringify(users));
}

export async function addUser(user: Omit<User, 'id' | 'createdAt'> & { password?: string }) {
    await loadUsers();
    const newUser: User = {
        id: (users.length + 1).toString(),
        ...user,
        createdAt: new Date(),
    } as User;
    if (user.password) {
        (newUser as any).password = user.password;
    }
    users.push(newUser);
    await saveUsers(users);
    return newUser;
}

export async function deleteUser(userId: string) {
    await loadUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        throw new Error('User not found');
    }
    
    users.splice(userIndex, 1);
    await saveUsers(users);
}