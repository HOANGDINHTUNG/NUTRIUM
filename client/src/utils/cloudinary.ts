// src/utils/cloudinary.ts
export const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_NAME as string;
export const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET as string;

type BuildOpts = {
  w?: number; h?: number;
  c?: "fill" | "fit" | "scale" | "thumb" | "crop";
  q?: string | number;
  f?: string;
};

export function isCloudinaryUrl(url: string) {
  return /^https?:\/\/res\.cloudinary\.com\//.test(url);
}

export function cldUrl(input: string, opts: BuildOpts = {}) {
  const { w = 640, h = 480, c = "fill", q = "auto", f = "auto" } = opts;
  const transform = `f_${f},q_${q},w_${w},h_${h},c_${c}`;
  // input là Cloudinary URL
  if (/^https?:\/\//.test(input) && isCloudinaryUrl(input)) {
    return input.replace("/upload/", `/upload/${transform}/`);
  }
  // input là public_id
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${input}`;
}

// Hỗ trợ: File | Blob | base64 dataURL | URL string
export async function postImageCloudinary(file: File | Blob | string): Promise<string> {
  const form = new FormData();
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("cloud_name", CLOUD_NAME);
  form.append("file", file);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Upload Cloudinary failed");
  const data = await res.json();
  return data.secure_url as string;
}
