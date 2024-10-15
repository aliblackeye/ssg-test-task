import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState, useEffect } from 'react';

interface TaskFormProps {
  onTaskCreated: () => void;
}

const TaskForm = ({ onTaskCreated }: TaskFormProps) => {
  const { register, handleSubmit, reset } = useForm();
  const [users, setUsers] = useState([]);

  // Kullanıcıları backend'den çek
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Kullanıcı listesi alınamadı', error);
      }
    };
    fetchUsers();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const ownerIds = data.ownerIds.map((id: string) => Number(id)); // String ID'leri number'a dönüştür
      const token = localStorage.getItem('access_token'); // Token'ı localStorage'dan al

      await axios.post(
        'http://localhost:4000/tasks/create',
        {
          description: data.description,
          ownerIds, // Sahipleri seçilen kullanıcılarla atıyoruz
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Header'a token'ı ekle
          },
        },
      );

      reset();
      onTaskCreated(); // Task oluşturulduktan sonra task'ları tekrar getir
    } catch (error) {
      console.error('Task oluşturulamadı', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Task Description
        </label>
        <input
          id="description"
          {...register('description', { required: true })}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter task description"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="owners"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Assign Owners
        </label>
        <select
          id="owners"
          {...register('ownerIds', { required: true })}
          multiple
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {users.map((user: any) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
