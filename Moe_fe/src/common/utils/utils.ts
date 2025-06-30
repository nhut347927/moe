import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTimeAgo(isoDateString: string): string {
  const now = new Date();
  const past = new Date(isoDateString);

  const diff = now.getTime() - past.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minutes`;    
  if (hours < 24) return `${hours} hours`;
  if (days < 7) return `${days} days`;
  if (weeks < 4) return `${weeks} weeks`;
  if (months < 12) return `${months} months`;
  return `${years} years`;
}


export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // sẽ bao gồm cả header: data:image/png;base64,...
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
