import { v4 as uuidv4 } from 'uuid';
import { db, type User } from '@/lib/db/schema';

//TODO: implement delete user function

export async function initializeUser(): Promise<string> {
  // Should only be one user in the database (1 row)
  const existingUsers = await db.user.toArray();
  
  if (existingUsers.length > 0) {
    return existingUsers[0].id;
  }
  
  const userId = uuidv4();
  const user: User = { id: userId };
  
  await db.user.add(user);
  return userId;
}

export async function getUserId(): Promise<string | null> {
  const users = await db.user.toArray();
  return users.length > 0 ? users[0].id : null;
}