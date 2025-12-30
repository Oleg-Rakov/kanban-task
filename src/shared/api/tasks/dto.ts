export type StatusDto = "backlog" | "in_progress" | "done";
export type LabelDto = "frontend" | "backend" | "bug" | "feature" | "urgent";

export interface TaskDto {
  id: string;
  name: string;
  key: string;
  description: string;
  status: StatusDto;
  labels: LabelDto[];
}
