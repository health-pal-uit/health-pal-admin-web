"use client";

import { useState } from "react";
import { Search, CheckCircle, XCircle, Flag } from "lucide-react";
import { Post, PostStatus } from "./type";
import { PostCard } from "./components/post-card";
import { ReviewModal } from "./components/review-modal";

const mockPosts: Post[] = [
  {
    id: 1,
    author: "Sarah Johnson",
    username: "@sarah_fitness",
    content:
      "Hello everyone! I lost 5kg after 2 months of training and healthy eating. Thank you app for helping me track my progress so detailed!",
    likes: 45,
    comments: 12,
    status: "pending",
    createdAt: "2 hours ago",
    reportCount: 0,
    hasImage: true,
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    author: "Michael Chen",
    username: "@mike_gym",
    content:
      "Sharing my clean eating meal plan for this week. DM me if you need it!",
    likes: 23,
    comments: 8,
    status: "pending",
    createdAt: "5 hours ago",
    reportCount: 0,
    hasImage: true,
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    author: "Emma Williams",
    username: "@emma_yoga",
    content:
      "This morning yoga session was amazing! Feeling light and energized.",
    likes: 67,
    comments: 15,
    status: "approved",
    createdAt: "1 day ago",
    reportCount: 0,
    hasImage: false,
  },
  {
    id: 4,
    author: "David Martinez",
    username: "@david_runner",
    content: "Just completed a 10km run. Next goal is 15km!",
    likes: 89,
    comments: 21,
    status: "approved",
    createdAt: "1 day ago",
    reportCount: 0,
    hasImage: true,
    imageUrl:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    author: "Spam User",
    username: "@spam_account",
    content:
      "Buy fast weight loss pills, 100% effective. DM for more details!!!",
    likes: 2,
    comments: 0,
    status: "flagged",
    createdAt: "30 minutes ago",
    reportCount: 5,
    hasImage: false,
  },
];

// --- Component Trang ---
export default function CommunityPage() {
  // --- STATE QUẢN LÝ TRANG ---
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<PostStatus>("pending");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null,
  );

  // --- Lọc dữ liệu ---
  const filteredPosts = mockPosts.filter(
    (post) =>
      post.status === activeTab &&
      (post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.username.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // --- Hàm xử lý Modal ---
  const handleReview = (post: Post, action: "approve" | "reject") => {
    setSelectedPost(post);
    setReviewAction(action);
    (document.getElementById("review_modal") as HTMLDialogElement)?.showModal();
  };

  const handleViewDetails = (post: Post) => {
    // Tạm thời, View Details cũng sẽ mở Review Modal
    setSelectedPost(post);
    setReviewAction(null); // Không có action cụ thể
    (document.getElementById("review_modal") as HTMLDialogElement)?.showModal();
  };

  const handleCloseModal = () => {
    (document.getElementById("review_modal") as HTMLDialogElement)?.close();
    setTimeout(() => {
      setSelectedPost(null);
      setReviewAction(null);
    }, 300);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. PHẦN HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Community Moderation
          </h1>
          <p className="text-base-content/70">
            Review and moderate posts and comments from the community
          </p>
        </div>
        {/* (Không có nút Add) */}
      </div>

      {/* 2. TABS (Dùng style từ trang Recipes) */}
      <div className="flex w-fit items-center gap-2 p-1 rounded-full bg-base-300">
        <button
          className={`btn btn-sm rounded-full gap-2 ${activeTab === "pending" ? "bg-base-100 text-base-content" : "btn-ghost"}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
          <div className="badge badge-ghost ml-1">2</div>
        </button>
        <button
          className={`btn btn-sm rounded-full gap-2 ${activeTab === "flagged" ? "bg-base-100 text-base-content" : "btn-ghost"}`}
          onClick={() => setActiveTab("flagged")}
        >
          <Flag className="h-4 w-4" />
          Reported
          <div className="badge badge-error ml-1">1</div>
        </button>
        <button
          className={`btn btn-sm rounded-full gap-2 ${activeTab === "approved" ? "bg-base-200 text-base-content" : "btn-ghost"}`}
          onClick={() => setActiveTab("approved")}
        >
          <CheckCircle className="h-4 w-4" />
          Approved
        </button>
        <button
          className={`btn btn-sm rounded-full gap-2 ${activeTab === "rejected" ? "bg-base-200 text-base-content" : "btn-ghost"}`}
          onClick={() => setActiveTab("rejected")}
        >
          <XCircle className="h-4 w-4" />
          Rejected
        </button>
      </div>

      {/* 3. THANH TÌM KIẾM */}
      <label className="input input-bordered flex items-center gap-2 rounded-full">
        <Search className="h-5 w-5 text-base-content/60" />
        <input
          type="text"
          className="grow"
          placeholder="Search posts by content, author, or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </label>

      {/* 4. KHU VỰC NỘI DUNG TABS (Render PostCard) */}
      <div className="space-y-4">
        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-base-content/60">
            No posts found for this tab.
          </div>
        )}

        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onReview={handleReview}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* --- 5. MODAL (Gọi component con) --- */}
      <ReviewModal
        post={selectedPost}
        action={reviewAction}
        onClose={handleCloseModal}
      />
    </div>
  );
}
