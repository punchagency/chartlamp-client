"use client";
import ResetPassword from "@/containers/auth/resetPassword";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}
