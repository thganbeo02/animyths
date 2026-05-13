import { UserId } from './branded';

export interface Profile {
  id: UserId;
  username: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  createdAt: Date;
}

export type AuthState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'authenticated'; userId: UserId; sessionExpiresAt: Date }
  | { status: 'unauthenticated' }
  | { status: 'error'; error: string };
