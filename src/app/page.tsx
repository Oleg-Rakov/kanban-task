import { TasksPage } from "@/pages/tasks";
import { getAllTasks } from "@/app/api/tasks/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const tasks = await getAllTasks();
  return <TasksPage initialTasks={tasks.slice(0, 20)} />;
}
