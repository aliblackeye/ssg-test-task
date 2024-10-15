import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from '@/components/task-form';
import TaskList from '@/components/task-list';
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

    if (!token && !user) {
      // Yönlendirme işlemi setTimeout içinde sarılı olursa, bileşenin render edilmesini bekleyebiliriz
      setTimeout(() => {
        router.push('/sign-in');
      }, 0);
    } else if (token && !user) {
      // Eğer token varsa ama kullanıcı bilgisi henüz set edilmediyse
      axios
        .get('http://localhost:4000/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data.email); // Kullanıcıyı set et
          fetchTasks(); // Task'ları getir
        })
        .catch(() => {
          setTimeout(() => {
            router.push('/sign-in'); // Token geçersizse tekrar giriş yap
          }, 0);
        });
    } else {
      fetchTasks();
    }
  }, [user, router, fetchTasks, setUser]);

  if (!user) {
    return null; // Kullanıcı giriş yapmamışsa hiçbir şey render etme
  }

  return (
    <div>
      <h1>Tasks</h1>
      <TaskForm onTaskCreated={fetchTasks} />{' '}
      <TaskList tasks={tasks} onTaskDeleted={fetchTasks} />{' '}
    </div>
  );
};

export default TasksPage;
