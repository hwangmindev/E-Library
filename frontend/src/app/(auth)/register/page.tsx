"use client";

import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <RegisterForm />

        {/* Footer */}
        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link
            href={"/login"}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
