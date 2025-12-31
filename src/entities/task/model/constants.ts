import type { Label, Status } from "./types";

export const STATUSES: { value: Status; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export const LABELS: { value: Label; label: string }[] = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "urgent", label: "Urgent" },
];
