import { TaskList } from '@/components/task-list';
import { useEffect, useState } from 'react';

const TasksPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return <>{isMounted && <TaskList />}</>;
};

export default TasksPage;
