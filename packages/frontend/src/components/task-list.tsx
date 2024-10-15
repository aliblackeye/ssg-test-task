import axios from 'axios';
import { useAuthContext } from '@/context/auth-context'; // Auth context'i ekliyoruz

interface Task {
  id: number;
  description: string;
  owners: { fullname: string }[];
}

interface TaskListProps {
  tasks: Task[];
  onTaskDeleted: () => void;
}

const TaskList = ({ tasks, onTaskDeleted }: TaskListProps) => {
  const { user: me } = useAuthContext(); // Kullanıcı bilgilerini alıyoruz
  const token = localStorage.getItem('access_token'); // Token'ı localStorage'dan al

  const handleDelete = async (taskId: number) => {
    try {
      await axios.delete(`http://localhost:4000/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Header'a token'ı ekle
        },
      });
      onTaskDeleted(); // Task silindiğinde task listesini güncelle
    } catch (error) {
      console.error('Task silinemedi', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Task List</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="bg-gray-100 p-4 rounded shadow-md flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{task.description}</p>
                <p className="text-gray-600">
                  Owners: {task.owners?.map((user) => user.fullname).join(', ')}
                </p>
              </div>
              <button
                onClick={() => handleDelete(task.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
