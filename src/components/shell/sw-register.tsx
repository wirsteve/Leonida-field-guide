"use client";

import { useEffect } from "react";

/** Registers the app-shell service worker in production builds only. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      /* offline support is a progressive enhancement */
    });
  }, []);
  return null;
}
