  import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export interface UserPayload {
  userId: string;
  username: string;
  name: string;
}

export async function getUserFromToken(): Promise<UserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as UserPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function requireAuth(request?: NextRequest): Promise<UserPayload> {
  const user = await getUserFromToken();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
