export type PostStatus = "pending" | "approved" | "rejected" | "flagged";

export type Post = {
  id: number;
  author: string;
  username: string;
  content: string;
  likes: number;
  comments: number;
  status: PostStatus;
  createdAt: string;
  reportCount: number;
  hasImage: boolean;
  imageUrl?: string;
};
