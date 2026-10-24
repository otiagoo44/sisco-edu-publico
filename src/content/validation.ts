import type { Student } from "./types";
export function publishedStudents(items: Student[]) {
  return items
    .filter(
      (student) =>
        student.status === "published" &&
        student.name.trim() &&
        student.message.trim() &&
        student.photo?.src.trim() &&
        student.photo.alt.trim(),
    )
    .sort((a, b) => a.order - b.order);
}
