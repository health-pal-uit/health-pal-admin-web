import type { NextPage } from "next";
import Image from "next/image";

// Icon này dùng để hiển thị/ẩn mật khẩu, thay thế cho .buttonIcon của bạn
// Bạn có thể thay thế bằng <Image /> nếu muốn, nhưng SVG thường dễ dùng hơn
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer text-gray-400"
  >
    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    <path
      fillRule="evenodd"
      d="M.464 10.585C1.72 8.58 4.706 5.5 10 5.5s8.28 3.08 9.536 5.085a1.25 1.25 0 010 1.33C18.28 13.92 15.294 17 10 17s-8.28-3.08-9.536-5.085a1.25 1.25 0 010-1.33zM10 15c4.07 0 6.72-2.384 7.854-4C16.72 9.384 14.07 7 10 7S3.28 9.384 2.146 11c1.135 1.616 3.784 4 7.854 4z"
      clipRule="evenodd"
    />
  </svg>
);

const LoginPage: NextPage = () => {
  return (
    // Sử dụng class của Tailwind để căn giữa toàn bộ trang
    // bg-base-200 là màu nền xám nhạt của DaisyUI (giống #f9fafb của bạn)
    <main className="flex min-h-screen flex-col items-center justify-center bg-base-200 p-4">
      {/* Sử dụng component 'card' của DaisyUI.
        bg-base-100 là màu nền trắng (giống #fff của bạn)
      */}
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          {/* === PHẦN HEADER === */}
          {/* Lưu ý: Bạn cần đặt logo của mình vào /public/health-pal-logo.png
            hoặc thay đổi đường dẫn 'src' bên dưới.
          */}
          <Image
            src="/health-pal-logo.png" // <-- THAY ĐỔI ĐƯỜNG DẪN NÀY
            width={70}
            height={70}
            alt="Health Pal Logo"
            className="rounded-lg" // Tailwind class thay cho .imageHealthPal
          />

          {/* 'text-primary' sẽ sử dụng màu chính của DaisyUI
            (màu #2d8b6e bạn dùng có thể được set là màu 'primary' trong tailwind.config.ts)
          */}
          <h1 className="text-2xl font-bold text-primary mt-2">
            Health Pal Admin
          </h1>

          {/* text-base-content/60 tạo màu xám (giống #6b7280) */}
          <p className="text-base-content/60">
            Sign in to manage your dashboard
          </p>

          {/* === PHẦN FORM === */}
          <form className="mt-4 flex w-full flex-col gap-4 text-left">
            {/* --- Trường Email --- */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="admin@healthpal.com"
                className="input input-bordered w-full"
              />
            </div>

            {/* --- Trường Password --- */}
            <div className="form-control w-full">
              <div className="flex justify-between">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <label className="label">
                  <a href="#" className="link link-primary label-text-alt">
                    Forgot password?
                  </a>
                </label>
              </div>

              {/* Cần 'relative' để đặt icon vào trong input */}
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="input input-bordered w-full pr-10" // pr-10 để chừa chỗ cho icon
                />
                <EyeIcon />
              </div>
            </div>

            {/* --- Nút Đăng nhập --- */}
            <button className="btn btn-primary w-full mt-4">Sign In</button>
          </form>

          {/* === PHẦN FOOTER === */}
          <div className="mt-4 text-xs text-base-content/60">
            Protected by Health Pal Security
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
