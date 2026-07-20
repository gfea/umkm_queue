import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  // Ponytail: simple tailwind merge, upgrade if dynamic keys conflict
  try {
    return twMerge(clsx(inputs))
  } catch {
    return clsx(inputs)
  }
}
