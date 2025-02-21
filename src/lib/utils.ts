import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type ActiveTab = "week" | "month" | "year";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateString(str: string, num: number) {
  return str.length > num ? `${str.slice(0, num)}...` : str;
}

export async function parseImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const converted = await fetch(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const response: {
    data: { url: String };
  } = await converted.json();

  return response.data.url;
}
