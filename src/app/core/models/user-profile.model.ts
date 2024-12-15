export interface UserProfile {
  id: string;
  userId: string;
  username?: string;
  email: string;
  avatarUrl?: string;
  joinedAt?: Date;
}
