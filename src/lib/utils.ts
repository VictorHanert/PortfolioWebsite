import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to format dates
export const formatVisitDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
};
