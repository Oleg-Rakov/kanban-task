"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Task } from "@/entities/task/model/types";
import { taskFromDto } from "@/entities/task/model/mapper";
import { tasksService } from "@/shared/api/tasks/tasks.service";
import type { TaskDto } from "@/shared/api/tasks/dto";

const KEY = ["tasks"] as const;

export function useTasksQuery(initial?: TaskDto[]) {
  return useQuery<Task[], Error>({
    queryKey: KEY,
    queryFn: async () => (await tasksService.getTasks()).map(taskFromDto),
    initialData: initial ? initial.map(taskFromDto) : undefined,
  });
}

export function useCreateTaskMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Omit<Task, "id">) => taskFromDto(await tasksService.createTask(body as any)),
    onSuccess: (created) => {
      qc.setQueryData<Task[]>(KEY, (prev) => (prev ? [created, ...prev] : [created]));
    },
  });
}

export function useUpdateTaskMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Omit<Task, "id">> }) =>
      taskFromDto(await tasksService.updateTask(id, patch as any)),
    onSuccess: (updated) => {
      qc.setQueryData<Task[]>(KEY, (prev) => (prev ? prev.map((t) => (t.id === updated.id ? updated : t)) : [updated]));
    },
  });
}

export function useDeleteTaskMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await tasksService.deleteTask(id);
      return id;
    },
    onSuccess: (id) => {
      qc.setQueryData<Task[]>(KEY, (prev) => (prev ? prev.filter((t) => t.id !== id) : prev));
    },
  });
}
