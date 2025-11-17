"use client";

import { User } from "../type";

interface UserDetailModalProps {
  user: User | null;
  onClose: () => void;
}

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  return (
    <dialog id="user_details_modal" className="modal">
      {user && (
        <div className="modal-box">
          <h3 className="font-bold text-lg">User Details</h3>
          <div className="py-4 space-y-2">
            <p>
              <strong>Full Name:</strong> {user.name}
            </p>
            <p>
              <strong>Username:</strong> @{user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Gender:</strong> {user.gender}
            </p>
            <p>
              <strong>Birth Date:</strong> {user.birthDate}
            </p>
            <p>
              <strong>Status:</strong> {user.status}
            </p>
            <p>
              <strong>Joined:</strong> {user.joined}
            </p>
          </div>
          <div className="modal-action">
            <button className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      )}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
