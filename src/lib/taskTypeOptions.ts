import type { TaskTypeEnum } from "@/lib/api/types/util-types";

export interface TaskTypeOption {
  value: TaskTypeEnum;
  label: string;
}

export const TASK_TYPE_OPTIONS: TaskTypeOption[] = [
  { value: "daily", label: "Diária" },
  { value: "weekly", label: "Semanal" },
  { value: "zone", label: "Zona" },
];