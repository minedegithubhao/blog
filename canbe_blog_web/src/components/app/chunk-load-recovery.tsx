"use client";

import { useEffect } from "react";

const RECOVERY_KEY_PREFIX = "canbe_blog_chunk_recovery:";

function isChunkLoadError(errorLike: unknown) {
  const message =
    errorLike instanceof Error
      ? errorLike.message
      : typeof errorLike === "string"
        ? errorLike
        : typeof errorLike === "object" && errorLike && "message" in errorLike
          ? String((errorLike as { message?: unknown }).message ?? "")
          : "";

  return [
    "ChunkLoadError",
    "Loading chunk",
    "_next/static/chunks",
    "Failed to fetch dynamically imported module",
    "Cannot find module './",
    "page.js"
  ].some((pattern) => message.includes(pattern));
}

export function ChunkLoadRecovery() {
  useEffect(() => {
    const currentPath = `${window.location.pathname}${window.location.search}`;
    const recoveryKey = `${RECOVERY_KEY_PREFIX}${currentPath}`;

    function recover() {
      const recovered = window.sessionStorage.getItem(recoveryKey);
      if (recovered === "1") {
        return;
      }

      window.sessionStorage.setItem(recoveryKey, "1");
      window.location.reload();
    }

    function handleError(event: ErrorEvent) {
      if (isChunkLoadError(event.error ?? event.message)) {
        recover();
      }
    }

    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      if (isChunkLoadError(event.reason)) {
        event.preventDefault();
        recover();
      }
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
