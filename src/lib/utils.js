import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional classes via clsx and resolves conflicting Tailwind utility classes.
 * 
 * @param {...any} inputs - Class names, conditional objects, or arrays
 * @returns {string} - Clean, deduped className string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default cn;
