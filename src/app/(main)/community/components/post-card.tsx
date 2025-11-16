"use client";

import Image from "next/image";
import { MoreVertical, Eye, CheckCircle, XCircle, Flag } from "lucide-react";
import { Post } from "../type";

interface PostCardProps {
  post: Post;
  onReview: (post: Post, action: "approve" | "reject") => void;
  onViewDetails: (post: Post) => void;
}

export function PostCard({ post, onReview, onViewDetails }: PostCardProps) {
  const cardBorderColor = () => {
    if (post.status === "flagged") return "border-error";
    if (post.status === "pending") return "border-warning/50";
    return "border-base-200";
  };

  return (
    <div className={`card bg-base-100 shadow-xl border ${cardBorderColor()}`}>
      <div className="card-body">
        <div className="flex gap-4">
          <div className="avatar placeholder">
            <div
              className={`rounded-full w-12 ${
                post.status === "flagged"
                  ? "bg-error/10 text-error"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <span>{post.author.charAt(0)}</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-base-content">{post.author}</h4>
                <p className="text-sm text-base-content/60">
                  {post.username} • {post.createdAt}
                </p>
              </div>

              {post.status === "flagged" ? (
                <div className="badge badge-error gap-1">
                  <Flag className="h-3 w-3" />
                  {post.reportCount} reports
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>

        <p className="text-base-content py-4">{post.content}</p>

        {post.hasImage && post.imageUrl && (
          <figure className="mb-4 rounded-lg overflow-hidden">
            <Image
              src={post.imageUrl}
              alt="Post image"
              width={500}
              height={300}
              className="w-full h-64 object-cover"
            />
          </figure>
        )}

        <div className="flex items-center gap-4 text-base-content/60 text-sm mb-4">
          <span>{post.likes} likes</span>
          <span>{post.comments} comments</span>
        </div>

        {post.status === "pending" && (
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

        {post.status === "flagged" && (
          <div className="card-actions justify-start gap-2">
            <button
              className="btn btn-sm btn-outline btn-ghost rounded-full"
              onClick={() => onViewDetails(post)}
            >
              <Eye className="h-4 w-4" /> View Reports
            </button>
            <button
              className="btn btn-sm btn-outline btn-error rounded-full"
              onClick={() => onReview(post, "reject")}
            >
              <XCircle className="h-4 w-4" /> Delete Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
