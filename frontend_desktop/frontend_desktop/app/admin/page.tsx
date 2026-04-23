"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // In a real app, check auth state here. For now, redirect to standardized login.
    router.replace("/admin/login");
  }, [router]);

  return null;
}
