"use client";

import React from "react";
import type { Task } from "@/entities/task/model/types";
import type { TaskDto } from "@/shared/api/tasks/dto";
import { useTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from "@/entities/task/api/useTasks";
import { TasksBoard } from "@/widgets/tasks-board";
import { Button } from "@/shared/ui/button";
import { useModal } from "@/shared/ui/modal";
import { TaskModal } from "@/features/task/task-modal/ui/TaskModal";
import { useToast } from "@/shared/ui/toast";

export function TasksPage({ initialTasks }: { initialTasks: TaskDto[] }) {
    const toast = useToast();
    const { open } = useModal();

    const { data, isLoading, isError, error } = useTasksQuery(initialTasks);
    const tasks: Task[] = data ?? [];

    const createMut = useCreateTaskMutation();
    const updateMut = useUpdateTaskMutation();
    const deleteMut = useDeleteTaskMutation();

    React.useEffect(() => {
        if (isError) toast.error((error as any)?.message ?? "Failed to load tasks");
    }, [isError, error, toast]);

    const isPending = createMut.isPending || updateMut.isPending || deleteMut.isPending;

    const existingKeys = React.useMemo(() => new Set((tasks ?? []).map((t) => t.key)), [tasks]);

    const openCreate = () => {
        open(
            <TaskModal
                mode="create"
                existingKeys={existingKeys}
                onCreate={async (body) => {
                    await createMut.mutateAsync(body);
                }}
                onUpdate={async () => {}}
                onDelete={async () => {}}
                isPending={isPending}
            />
        );
    };

    const openEdit = (task: Task) => {
        open(
            <TaskModal
                mode="edit"
                task={task}
                existingKeys={existingKeys}
                onCreate={async () => {}}
                onUpdate={async (id, patch) => {
                    await updateMut.mutateAsync({ id, patch });
                }}
                onDelete={async (id) => {
                    try {
                        await deleteMut.mutateAsync(id);
                    } catch (e: any) {
                        // If backend returns 409, show a human message
                        const msg = e?.message ?? "Cannot delete task";
                        throw new Error(msg);
                    }
                }}
                isPending={isPending}
            />
        );
    };

    return (
        <div className="mx-auto max-w-[1240px] px-4 py-10">
            <div className="mb-8 flex items-center justify-end">
                <Button onClick={openCreate}>Create Task</Button>
            </div>

            {isLoading && !tasks?.length ? (
                <div className="text-sm text-primary-700">Loading…</div>
            ) : (
                <TasksBoard tasks={tasks} onTaskClick={openEdit} />
            )}
        </div>
    );
}
