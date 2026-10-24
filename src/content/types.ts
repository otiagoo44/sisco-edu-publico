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
  photos: ContentImage[];
  order: number;
  composition: "construction" | "blueprint" | "travel" | "workspace";
  date?: { label: string; confirmed: true };
};
export type Student = {
  id: string;
  name: string;
  photo: ContentImage | null;
  message: string;
  order: number;
  status: "draft" | "published";
};
