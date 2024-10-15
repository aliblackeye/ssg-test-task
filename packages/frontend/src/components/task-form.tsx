'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { MultiSelect, OptionType } from '@/components/ui/multi-select'; // MultiSelect bileşenini import ettik
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input'; // Shadcn'den gelen Input bileşenini import ettik

// Zod ile form şeması tanımlama
const formSchema = z.object({
  description: z.string().min(1, { message: 'Description is required.' }), // Zorunlu alan
  owners: z
    .array(z.string())
    .min(1, { message: 'At least one owner must be selected.' }), // Zorunlu alan
});

interface TaskFormProps {
  onTaskCreated: () => void;
  currentUserId: number; // Mevcut kullanıcı ID'sini prop olarak al
}

const TaskForm = ({ onTaskCreated, currentUserId }: TaskFormProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      owners: [],
    },
  });

  const { handleSubmit, reset, control } = form;
  const [users, setUsers] = useState<OptionType[]>([]); // Kullanıcıları saklamak için state

  // Kullanıcıları backend'den çek
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/users');
        const userOptions = response.data
          .filter((user: any) => user.id !== currentUserId) // Kendi ID'mizi filtrele
          .map((user: any) => ({
            value: user.id.toString(), // ID'yi string olarak saklıyoruz
            label: user.email,
          }));
        setUsers(userOptions);
      } catch (error) {
        console.error('Kullanıcı listesi alınamadı', error);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  const onSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem('access_token'); // Token'ı localStorage'dan al

      await axios.post(
        'http://localhost:4000/tasks/create',
        {
          description: data.description,
          ownerIds: data.owners.map(Number), // Seçilen kullanıcıları number olarak atıyoruz
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
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Task Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter task description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mb-4">
          <FormField
            control={control}
            name="owners"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Assign Owners <span className="text-red-500">*</span>
                </FormLabel>
                <MultiSelect
                  options={users} // Kullanıcıları seçenek olarak veriyoruz
                  selected={field.value || []} // Seçilen sahipleri register ile bağlıyoruz
                  onChange={(value) => {
                    // Seçim değiştiğinde form değerini güncelliyoruz
                    field.onChange(value);
                  }}
                  className="w-full"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <Button type="submit" variant={'default'}>
            Create Task
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
