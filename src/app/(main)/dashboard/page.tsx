// src/app/(main)/dashboard/page.tsx
import type { NextPage } from "next";
import Link from "next/link";

const DashboardTestPage: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-200 p-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-3xl text-success">
            ✅ Đăng nhập Thành công!
          </h1>

          <p className="py-4">
            Bạn đã navigate (chuyển hướng) đến trang Dashboard thành công.
          </p>

          <div className="card-actions">
            <Link href="/login" className="btn btn-primary">
              Quay lại Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTestPage;
