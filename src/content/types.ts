export type ContentImage = {
  src: string;
  alt: string;
  kind?: "photo" | "screenshot";
  position?: string;
  fit?: "cover" | "contain";
};
export type Memory = {
  id: string;
  title: string;
  navLabel?: string;
  description: string;
  media: MemoryMedia[];
  order: number;
  composition: "construction" | "blueprint" | "travel" | "competition" | "workspace";
  date?: { label: string; confirmed: true };
};
export type MemoryPhoto = {
  type: "image";
  image: ContentImage;
  caption: string;
  order: number;
  holdSeconds?: number;
};
export type MemoryVideo = {
  type: "video";
  src: string;
  poster: string;
  alt: string;
  caption: string;
  chapter: string;
  order: number;
  duration: number;
  start?: number;
  end?: number;
  width: number;
  height: number;
  sound: "available" | "silent";
};
export type MemoryMedia = MemoryPhoto | MemoryVideo;
export type Student = {
  id: string;
  name: string;
  photo: ContentImage | null;
  message: string;
  order: number;
  status: "draft" | "published";
};
