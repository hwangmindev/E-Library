"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/lib/api/auth";
import { useAuthSession } from "@/hooks/useAuthSession";
import { AUTH_ACCOUNT_STORAGE_KEY } from "@/lib/constants/auth";

export default function AuthNavItems() {
  const { isLoggedIn, isLoading, refresh } = useAuthSession();
  const router = useRouter();
  const [avatar, setAvatar] = useState("/images/profile/default.png");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_ACCOUNT_STORAGE_KEY);

      if (!storedUser) {
        setAvatar("/images/profile/default.png");
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      setAvatar(parsedUser?.avatar || "/images/profile/default.png");
    } catch (error) {
      console.error("Invalid user in localStorage", error);
      setAvatar("/images/profile/default.png");
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    refresh();
    router.push("/");
  };

  if (isLoading) return null;

  return (
    <>
      {!isLoggedIn && (
        <>
          <Link
            href="/login"
            className="text-gray-600 hover:text-black transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-gray-600 hover:text-black transition"
          >
            Register
          </Link>
        </>
      )}
      {isLoggedIn && (
        <>
          <button
            type="button"
            onClick={handleLogout}
            className="text-gray-600 hover:text-black transition border-none"
          >
            logout
          </button>
          <Image
            loading="eager"
            src={avatar}
            alt="profile image"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
        </>
      )}
    </>
  );
}
