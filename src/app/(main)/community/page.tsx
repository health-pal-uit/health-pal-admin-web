"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, Flag } from "lucide-react";
import toast from "react-hot-toast";
import { Post, PostStatus } from "./type";
import { PostCard } from "./components/post-card";
import { ReviewModal } from "./components/review-modal";

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<PostStatus>("pending");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/posts");
      const result = await response.json();

      if (!response.ok) {
        throw Error(result.message || "Failed to fetch posts");
      }

      setPosts(result.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const getPostStatus = (post: Post): PostStatus => {
    if (post.deleted_at) return "rejected";
    if (post.is_approved) return "approved";
    return "pending";
  };

  const filteredPosts = posts.filter((post) => {
    const status = getPostStatus(post);
    if (status !== activeTab) return false;

    const query = searchQuery.toLowerCase();
    return (
      post.content.toLowerCase().includes(query) ||
      post.user.fullname.toLowerCase().includes(query) ||
      post.user.username.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage,
  );

  const getPendingCount = () =>
    posts.filter((p) => !p.is_approved && !p.deleted_at).length;
  const getApprovedCount = () => posts.filter((p) => p.is_approved).length;
  const getRejectedCount = () => posts.filter((p) => p.deleted_at).length;

  const handleReview = (post: Post, action: "approve" | "reject") => {
    setSelectedPost(post);
    setReviewAction(action);
    (document.getElementById("review_modal") as HTMLDialogElement)?.showModal();
  };

  const handleViewDetails = (post: Post) => {
    setSelectedPost(post);
    setReviewAction(null);
    (document.getElementById("review_modal") as HTMLDialogElement)?.showModal();
  };

  const handleCloseModal = () => {
    (document.getElementById("review_modal") as HTMLDialogElement)?.close();
    setTimeout(() => {
      setSelectedPost(null);
      setReviewAction(null);
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Community Moderation
          </h1>
          <p className="text-base-content/70">
            Review and moderate posts and comments from the community
          </p>
        </div>
      </div>

      <div className="flex w-fit items-center gap-2 p-1 rounded-full bg-base-300">
        <button
          className={`btn btn-sm rounded-full gap-2 ${activeTab === "pending" ? "bg-base-100 text-base-content" : "btn-ghost"}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
          {getPendingCount() > 0 && (
            <div className="badge badge-ghost ml-1">{getPendingCount()}</div>
          )}
        </button>
        <button
          className={`btn btn-sm rounded-full gap-2 ${activeTab === "flagged" ? "bg-base-100 text-base-content" : "btn-ghost"}`}
          onClick={() => setActiveTab("flagged")}
        >
          <Flag className="h-4 w-4" />
          Reported
          <div className="badge badge-error ml-1">0</div>
        </button>
        <button
          className={`btn btn-sm rounded-full gap-2 ${activeTab === "approved" ? "bg-base-200 text-base-content" : "btn-ghost"}`}
          onClick={() => setActiveTab("approved")}
        >
          <CheckCircle className="h-4 w-4" />
          Approved
          {getApprovedCount() > 0 && (
            <div className="badge badge-ghost ml-1">{getApprovedCount()}</div>
          )}
        </button>
        <button
          className={`btn btn-sm rounded-full gap-2 ${activeTab === "rejected" ? "bg-base-200 text-base-content" : "btn-ghost"}`}
          onClick={() => setActiveTab("rejected")}
        >
          <XCircle className="h-4 w-4" />
          Rejected
          {getRejectedCount() > 0 && (
            <div className="badge badge-ghost ml-1">{getRejectedCount()}</div>
          )}
        </button>
      </div>

      <label className="input input-bordered flex items-center gap-2 rounded-full">
        <Search className="h-5 w-5 text-base-content/60" />
        <input
          type="text"
          className="grow"
          placeholder="Search posts by content, or username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </label>

      <div className="space-y-4">
        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-base-content/60">
            No posts found for this tab.
          </div>
        )}

        {paginatedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onReview={handleReview}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            className="btn btn-sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`btn btn-sm ${
                  currentPage === page ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="btn btn-sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <ReviewModal
        post={selectedPost}
        action={reviewAction}
        onClose={handleCloseModal}
      />
    </div>
  );
}
