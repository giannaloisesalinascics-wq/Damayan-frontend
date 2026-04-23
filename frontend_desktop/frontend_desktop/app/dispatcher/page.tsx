"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DispatcherPage() {
  const router = useRouter();

  useEffect(() => {
    // In a real app, check auth state here. For now, redirect to standardized login.
    router.replace("/dispatcher/login");
  }, [router]);

  return null;
}
