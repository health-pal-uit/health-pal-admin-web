"use client";

import Image from "next/image";
import { MoreVertical, Eye, CheckCircle, XCircle } from "lucide-react";
import { Post } from "../type";

interface PostCardProps {
  post: Post;
  onReview: (post: Post, action: "approve" | "reject") => void;
  onViewDetails: (post: Post) => void;
}

export function PostCard({ post, onReview, onViewDetails }: PostCardProps) {
  const getStatus = () => {
    if (post.deleted_at) return "rejected";
    if (post.is_approved) return "approved";
    return "pending";
  };

  const status = getStatus();

  const cardBorderColor = () => {
    if (status === "pending") return "border-warning/50";
    if (status === "rejected") return "border-error/50";
    return "border-base-200";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString();
  };

  const getAttachTypeBadge = () => {
    if (post.attach_type === "none") return null;

    const badges = {
      meal: "badge-info",
      ingredient: "badge-success",
      challenge: "badge-warning",
      medal: "badge-primary",
    };

    return (
      <span className={`badge badge-sm ${badges[post.attach_type]}`}>
        {post.attach_type}
      </span>
    );
  };

  return (
    <div className={`card bg-base-100 shadow-xl border ${cardBorderColor()}`}>
      <div className="card-body">
        <div className="flex gap-4">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full">
              <Image
                src={post.user?.avatar_url || "/image/default-avatar.png"}
                alt={post.user?.fullname || "User"}
                width={48}
                height={48}
                className="rounded-full"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-base-content flex items-center gap-2">
                  {post.user?.fullname || "Unknown User"}
                  {getAttachTypeBadge()}
                </h4>
                <p className="text-sm text-base-content/60">
                  @{post.user?.username || "unknown"} •{" "}
                  {formatDate(post.created_at)}
                </p>
              </div>

              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  className="btn btn-ghost btn-circle btn-sm"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10"
                >
                  <li>
                    <a onClick={() => onViewDetails(post)}>
                      <Eye className="h-4 w-4" /> View Details
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <p className="text-base-content py-4">{post.content}</p>

        {status === "pending" && (
          <div className="card-actions justify-start gap-2">
            <button
              className="btn btn-sm btn-outline btn-success rounded-full"
              onClick={() => onReview(post, "approve")}
            >
              <CheckCircle className="h-4 w-4" /> Approve
            </button>
            <button
              className="btn btn-sm btn-outline btn-error rounded-full"
              onClick={() => onReview(post, "reject")}
            >
              <XCircle className="h-4 w-4" /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
