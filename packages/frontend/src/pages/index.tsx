import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { TaskList } from '@/components/task-list';
import { useAuthContext } from '@/context/auth-context';
import { useRouter } from 'next/router';

const TasksPage = () => {
  const { user, setUser } = useAuthContext(); // Kullanıcı bilgilerini alıyoruz
  const router = useRouter();
  const [tasks, setTasks] = useState([]);

  // Task'ları backend'den çek
  const fetchTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:4000/tasks', {
        headers: {
          Authorization: `Bearer ${token}`, // Token'ı ekle
        },
      });
      setTasks(response.data); // Görevleri güncelle
    } catch (error: any) {
      console.error('Task listesi alınamadı:', error);
      if (error.response.status === 401) {
        router.push('/sign-in');
      }
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!user && token) {
      const fetchUser = async () => {
        const response = await axios.get('http://localhost:4000/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        fetchTasks();
      };
      fetchUser();
    }
  }, [router, user, fetchTasks, setUser]);

  if (!user) {
    return null; // Kullanıcı henüz giriş yapmadıysa hiçbir şey render etme
  }

  return (
    <div>
      <TaskList
        tasks={tasks}
        fetchTasks={fetchTasks}
        currentUserId={Number(user.id)} // Mevcut kullanıcı ID'sini number olarak geç
      />
    </div>
  );
};

export default TasksPage;
