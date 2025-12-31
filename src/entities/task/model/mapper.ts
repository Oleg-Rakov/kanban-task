import type { TaskDto } from "@/shared/api/tasks/dto";
import type { Task } from "./types";

export function taskFromDto(dto: TaskDto): Task {
  return dto;
}

export function taskToDto(task: Task): TaskDto {
  return task;
}
