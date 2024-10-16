import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import axiosClient from '@/utils/axiosClient'; // Axios istemcisini import ettik
import { useState, useEffect, useCallback } from 'react';
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
import { useRouter } from 'next/router';
import { useAuthContext } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast'; // useToast hook'unu import ettik

interface Task {
  id: number;
  description: string;
  completed: boolean;
  owners: { id: number; fullname: string }[];
}

export const TaskList = () => {
  const { user } = useAuthContext(); // Kullanıcı ID'sini AuthContext'ten al
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showOwnedOnly, setShowOwnedOnly] = useState(false); // Checkbox durumu
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();
  const { toast } = useToast(); // Toast fonksiyonunu al

  // Task'ları backend'den çek
  const fetchTasks = useCallback(
    async (my?: boolean) => {
      try {
        const response = await axiosClient.get('tasks' + (my ? '/my' : ''));
        setTasks(response.data); // Görevleri güncelle
      } catch (error: any) {
        console.error('Task listesi alınamadı:', error);
        if (error.response.status === 401) {
          router.push('/sign-in');
        }
      }
    },
    [router],
  );

  const handleDelete = async (taskId: number) => {
    try {
      await axiosClient.delete(`tasks/${taskId}`);
      console.log(`Task with id ${taskId} deleted successfully.`);
      fetchTasks();
      toast({
        // Silme başarılı bildirim
        title: 'Task Deleted',
        description: 'Your task has been deleted successfully.',
      });
    } catch (error) {
      console.error(`Failed to delete task with id ${taskId}:`, error);
    }
  };

  // Bileşen yüklendiğinde görevleri fetchle
  useEffect(() => {
    fetchTasks(); // Görevleri al
  }, [fetchTasks]);

  return (
    <div className="bg-white text-center mx-auto max-w-[800px] h-screen flex flex-col justify-center">
      <h2 className="text-4xl font-bold mb-4">TASKS</h2>
      <div className="flex justify-between mb-4">
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
                fetchTasks(showOwnedOnly); // Görev oluşturulduktan sonra listeyi güncelle
                setIsDialogOpen(false); // Dialogu kapat
              }}
            />
          </DialogContent>
        </Dialog>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={showOwnedOnly}
            onChange={() => {
              setShowOwnedOnly(!showOwnedOnly);
              fetchTasks(!showOwnedOnly); // Checkbox durumu değiştiğinde görevleri yeniden yükle
            }}
            className="mr-2"
          />
          <label>Show owned only by me</label>
        </div>
      </div>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available.</p>
      ) : (
        <div className="border-2 border-gray-300 rounded-lg overflow-clip">
          <Table>
            <TableHeader>{/* Header rendering */}</TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {task.owners.some(
                            (owner) => owner.id === user?.id,
                          ) ? ( // Kullanıcı ID'si kontrolü
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
                                      handleDelete(task.id);
                                    }}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <span className="text-gray-500">No permission</span> // Yetki yoksa mesaj göster
                          )}
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
