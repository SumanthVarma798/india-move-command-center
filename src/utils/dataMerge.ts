import { initialData } from '../data/initialData';
import type { AppData, MoveTask } from '../types';

function mergeTask(seedTask: MoveTask, savedTask?: MoveTask): MoveTask {
  return {
    ...seedTask,
    status: savedTask?.status ?? seedTask.status,
  };
}

function mergeTaskList(seedTasks: MoveTask[], savedTasks: MoveTask[] = []) {
  return seedTasks.map((seedTask) => mergeTask(seedTask, savedTasks.find((task) => task.id === seedTask.id)));
}

export function hydrateAppData(savedData: AppData): AppData {
  return {
    ...initialData,
    ...savedData,
    meta: { ...initialData.meta, lastUpdated: savedData.meta?.lastUpdated ?? initialData.meta.lastUpdated },
    tasks: mergeTaskList(initialData.tasks, savedData.tasks),
    afterLanding: mergeTaskList(initialData.afterLanding, savedData.afterLanding),
    phoneChecklist: initialData.phoneChecklist.map((seedItem) => ({
      ...seedItem,
      status: savedData.phoneChecklist?.find((item) => item.id === seedItem.id)?.status ?? seedItem.status,
    })),
    documents: initialData.documents.map((seedItem) => ({
      ...seedItem,
      status: savedData.documents?.find((item) => item.id === seedItem.id)?.status ?? seedItem.status,
    })),
    finance: initialData.finance.map((seedItem) => ({
      ...seedItem,
      decision: savedData.finance?.find((item) => item.id === seedItem.id)?.decision ?? seedItem.decision,
      status: savedData.finance?.find((item) => item.id === seedItem.id)?.status ?? seedItem.status,
    })),
  };
}
