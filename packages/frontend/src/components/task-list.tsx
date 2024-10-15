import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import axios from 'axios';
import { useState } from 'react';
import TaskForm from '@/components/task-form';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Task {
  id: number;
  description: string;
  completed: boolean;
  owners: { fullname: string }[];
}

interface TaskListProps {
  tasks: Task[];
  fetchTasks: () => void; // fetchTasks prop'u
  currentUserId: number; // Mevcut kullanıcı ID'sini prop olarak al
}

export const TaskList = ({
  tasks,
  fetchTasks,
  currentUserId,
}: TaskListProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: 'completed',
      header: 'Completed',
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.original.completed}
          onChange={() =>
            handleToggleComplete(row.original.id, !row.original.completed)
          }
        />
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'owners',
      header: 'Owners',
      cell: ({ row }) =>
        row.original.owners.map((owner) => owner.fullname).join(', '),
    },
  ];

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDelete = async (taskId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:4000/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`Task with id ${taskId} deleted successfully.`);
      fetchTasks(); // Listeyi güncelle
    } catch (error) {
      console.error(`Failed to delete task with id ${taskId}:`, error);
    }
  };

  const handleToggleComplete = async (taskId: number, completed: boolean) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(
        `http://localhost:4000/tasks/${taskId}/status`,
        { completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(`Task with id ${taskId} status updated to ${completed}.`);
      fetchTasks(); // Durum güncellendikten sonra listeyi güncelle
    } catch (error) {
      console.error(`Failed to update task status for id ${taskId}:`, error);
    }
  };

  return (
    <div className="bg-white text-center mx-auto max-w-[800px] h-screen flex flex-col justify-center">
      <h2 className="text-4xl font-bold mb-4">TASKS</h2>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button variant={'default'} onClick={() => setIsDialogOpen(true)}>
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              onTaskCreated={() => {
                fetchTasks(); // Görev oluşturulduktan sonra listeyi güncelle
                setIsDialogOpen(false); // Dialogu kapat
              }}
              currentUserId={currentUserId} // Mevcut kullanıcı ID'sini geç
            />
          </DialogContent>
        </Dialog>
      </div>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available.</p>
      ) : (
        <div className="border-2 border-gray-300 rounded-lg overflow-clip">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-left">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the task.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    handleDelete(row.original.id);
                                  }}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Task</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
