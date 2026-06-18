import type { PostType } from './categories';

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  type: PostType;
  category: string;
  title: string;
  content: string;
  best_comment_id: string | null;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  author?: Profile | null;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  like_count: number;
  created_at: string;
  author?: Profile | null;
}
