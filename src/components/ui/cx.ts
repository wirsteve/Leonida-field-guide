import { clsx, type ClassValue } from "clsx";

/** Class-name joiner used across components. */
export function cx(...values: ClassValue[]): string {
  return clsx(values);
}
