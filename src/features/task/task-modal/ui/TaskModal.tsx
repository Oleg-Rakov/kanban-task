"use client";

import React from "react";
import type { Task, Status, Label } from "@/entities/task/model/types";
import { LABELS, STATUSES } from "@/entities/task/model/constants";
import { Button } from "@/shared/ui/button";
import { Input, Textarea } from "@/shared/ui/input";
import { MultiSelect, Select } from "@/shared/ui/select";
import { ModalShell, useModal } from "@/shared/ui/modal";
import { useToast } from "@/shared/ui/toast";
import { cn } from "@/shared/lib/cn";

type Mode = "create" | "edit";

export function TaskModal({
  mode,
  task,
  existingKeys,
  onCreate,
  onUpdate,
  onDelete,
  isPending,
}: {
  mode: Mode;
  task?: Task;
  existingKeys: Set<string>;
  onCreate: (body: Omit<Task, "id">) => Promise<void>;
  onUpdate: (id: string, patch: Partial<Omit<Task, "id">>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isPending: boolean;
}) {
  const { close, open } = useModal();
  const toast = useToast();

  const [name, setName] = React.useState(task?.name ?? "");
  const [key, setKey] = React.useState(task?.key ?? "");
  const [description, setDescription] = React.useState(task?.description ?? "");
  const [labels, setLabels] = React.useState<Label[]>(task?.labels ?? []);
  const [status, setStatus] = React.useState<Status>((task?.status ?? "backlog") as Status);

  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const errors = validate({
    mode,
    name,
    key,
    status,
    existingKeys,
    originalKey: task?.key,
  });

  const canSubmit = Object.keys(errors).length === 0 && !isPending;

  const onSubmit = async () => {
    setTouched({ name: true, key: true, status: true });
    if (Object.keys(errors).length) return;

    try {
      if (mode === "create") {
        await onCreate({
          name: name.trim(),
          key: key.trim(),
          description: description.trim(),
          labels,
          status: "backlog",
        });
        toast.success("Task created");
      } else if (task) {
        await onUpdate(task.id, {
          name: name.trim(),
          key: key.trim(),
          description: description.trim(),
          labels,
          status,
        });
        toast.success("Task updated");
      }
      close();
    } catch (e: any) {
      toast.error(e?.message ?? "Something went wrong");
    }
  };

  const requestDelete = () => {
    if (!task) return;
    open(<ConfirmDeleteModal name={task.name} onCancel={closeDeleteModal} onConfirm={confirmDelete} />);
  };

  const closeDeleteModal = () => {
    // close confirm and reopen this modal
    open(
      <TaskModal
        mode="edit"
        task={task}
        existingKeys={existingKeys}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isPending={isPending}
      />
    );
  };

  const confirmDelete = async () => {
    if (!task) return;
    try {
      await onDelete(task.id);
      toast.success("Task deleted");
      close();
    } catch (e: any) {
      toast.error(e?.message ?? "Cannot delete task");
      // go back to edit modal
      closeDeleteModal();
    }
  };

  return (
    <ModalShell
      title={mode === "create" ? "Create Task" : "Update Task"}
      onClose={close}
      footer={
        mode === "edit" ? (
          <div className="relative w-[432px] h-[36px]">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full flex items-center">
              <Button variant="text-danger" onClick={requestDelete} disabled={isPending}>
                Delete Task
              </Button>
            </div>
            <div className="ml-auto h-full flex items-center justify-end">
              <Button variant="primary" onClick={onSubmit} disabled={!canSubmit}>
                Update
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-end w-[432px] h-[36px]">
            <Button variant="primary" onClick={onSubmit} disabled={!canSubmit}>
              Create
            </Button>
          </div>
        )
      }
    >
      <div className="flex flex-col gap-[16px]">
        <Input
          label="Task Name"
          placeholder="e.g. SEO meta tags"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          error={touched.name ? errors.name : undefined}
        />

        <Input
          label="Task Key"
          placeholder="e.g. TASK-005"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, key: true }))}
          error={touched.key ? errors.key : undefined}
        />

        <Textarea
          label="Description"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        <div className={cn("grid items-start", mode === "edit" ? "grid-cols-2 gap-[24px]" : "grid-cols-1 gap-[16px]")}>
          <MultiSelect<Label>
              label="Labels"
              value={labels}
              onChange={setLabels}
            options={LABELS}
            placeholder="Choose Label"
          />

          {mode === "edit" ? (
            <Select<Status>
              label="Task Status"
              value={status}
              onChange={setStatus}
              options={STATUSES}
              placeholder="Choose Status"
              className=""
            />
          ) : null}
        </div>
      </div>
    </ModalShell>
  );
}

function validate({
  mode,
  name,
  key,
  status,
  existingKeys,
  originalKey,
}: {
  mode: Mode;
  name: string;
  key: string;
  status: Status;
  existingKeys: Set<string>;
  originalKey?: string;
}) {
  const errors: Record<string, string> = {};
  if (!name.trim()) errors.name = "Required";
  if (!key.trim()) errors.key = "Required";
  const normalized = key.trim();
  if (normalized) {
    const isDuplicate =
      existingKeys.has(normalized) && (mode === "create" || normalized !== (originalKey ?? ""));
    if (isDuplicate) errors.key = "Key must be unique";
  }
  if (mode === "edit" && !status) errors.status = "Required";
  return errors;
}

function ConfirmDeleteModal({
  name,
  onCancel,
  onConfirm,
}: {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { close } = useModal();

  return (
    <div
      className={cn(
        "w-[480px] h-[222px] rounded-xl3 bg-primary-400 shadow-modal",
        "relative overflow-visible p-[24px] flex flex-col gap-[32px]"
      )}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold leading-[20px] text-primary-900">Delete task “{name}”?</h2>

        <button
          type="button"
          onClick={() => {
            close();
            onCancel();
          }}
          aria-label="Close"
          className={cn(
            "inline-flex items-center justify-center",
            "w-[36px] h-[36px] rounded-[32px] p-[12px]",
            "bg-primary-200 text-primary-900 transition hover:bg-primary-300"
          )}
        >
          ×
        </button>
      </div>

      <p className="text-[12px] leading-[16px] text-primary-800">
        This action is irreversible. After deleting, you will lose access to all settings, groups,
        modification history, and results of this task. The task cannot be restored.
      </p>

      <div className="flex items-center justify-end gap-[32px]">
        <button
          type="button"
          onClick={() => {
            close();
            onCancel();
          }}
          className="w-[64px] h-[36px] rounded-[32px] px-[12px] py-[8px] text-[12px] font-medium leading-[20px] text-primary-900 whitespace-nowrap hover:opacity-80"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="w-[150px] h-[36px] rounded-[32px] px-[12px] py-[8px] text-[12px] font-medium leading-[12px] text-[#FEFEFE] bg-[#262626] whitespace-nowrap hover:opacity-90"        >
          Delete
        </button>
      </div>
    </div>
  );
}
