"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass, Home, NotebookPen, Wallet } from "lucide-react";
import { cx } from "@/components/ui/cx";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/strategy", label: "Strategy", icon: BookOpen },
  { href: "/money", label: "Money", icon: Wallet },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/journal", label: "Journal", icon: NotebookPen },
] as const;

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-night/85 backdrop-blur-xl backdrop-saturate-150"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      <ul className="mx-auto flex h-[var(--tabbar-h)] max-w-[640px] items-stretch px-1">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "tap flex h-full min-h-11 flex-col items-center justify-center gap-1",
                  active ? "text-ivory" : "text-ivory-3 hover:text-ivory-2",
                )}
              >
                <span className="relative grid place-items-center">
                  <Icon aria-hidden size={22} strokeWidth={active ? 2.1 : 1.7} />
                  {active && (
                    <span className="absolute -top-2.5 h-[3px] w-5 rounded-full bg-coral" aria-hidden />
                  )}
                </span>
                <span className="eyebrow text-[0.6875rem] tracking-[0.12em]">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
