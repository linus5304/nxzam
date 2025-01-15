import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type Parser<T, R> = (data: T) => R;

export function parseDbResponse<T, R>(
  data: T | null | undefined,
  parser: Parser<T, R>
): R | null {
  if (!data) return null;
  return parser(data);
}