import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names and merges Tailwind CSS classes.
 * @param inputs - The class names to combine.
 * @returns A string of combined class names.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}