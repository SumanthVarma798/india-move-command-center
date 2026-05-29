import { initialData } from '../data/initialData';
import type { AppData, MoveTask } from '../types';

function mergeTask(seedTask: MoveTask, savedTask?: MoveTask): MoveTask {
  return {
    ...seedTask,
    ...savedTask,
    completionCriteria: savedTask?.completionCriteria?.length ? savedTask.completionCriteria : seedTask.completionCriteria,
  };
}

function mergeTaskList(seedTasks: MoveTask[], savedTasks: MoveTask[] = []) {
  return seedTasks.map((seedTask) => mergeTask(seedTask, savedTasks.find((task) => task.id === seedTask.id)));
}

export function hydrateAppData(savedData: AppData): AppData {
  return {
    ...initialData,
    ...savedData,
    meta: { ...initialData.meta, ...savedData.meta },
    tasks: mergeTaskList(initialData.tasks, savedData.tasks),
    afterLanding: mergeTaskList(initialData.afterLanding, savedData.afterLanding),
    phoneChecklist: initialData.phoneChecklist.map((seedItem) => ({
      ...seedItem,
      ...savedData.phoneChecklist?.find((item) => item.id === seedItem.id),
    })),
    documents: initialData.documents.map((seedItem) => ({
      ...seedItem,
      ...savedData.documents?.find((item) => item.id === seedItem.id),
    })),
    finance: initialData.finance.map((seedItem) => ({
      ...seedItem,
      ...savedData.finance?.find((item) => item.id === seedItem.id),
    })),
  };
}
