'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, useCallback } from 'react';
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
import axiosClient from '@/utils/axiosClient'; // Axios istemcisini import ettik
import { useToast } from '@/hooks/use-toast'; // useToast hook'unu import ettik

// Zod ile form şeması tanımlama
const formSchema = z.object({
  description: z.string().min(1, { message: 'Task description is required.' }), // Zorunlu alan
  owners: z
    .array(z.number()) // owners alanını number olarak güncelledik
    .min(1, { message: 'At least one owner must be selected.' }) // Zorunlu alan
    .refine((owners) => owners.every((owner) => owner !== null), {
      message: 'Selected owners cannot be empty.',
    }), // Boş seçim kontrolü
});

interface TaskFormProps {
  onTaskCreated: () => void;
}

const TaskForm = ({ onTaskCreated }: TaskFormProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      owners: [],
    },
  });

  const { handleSubmit, reset, control } = form;
  const [users, setUsers] = useState<OptionType[]>([]); // Kullanıcıları saklamak için state

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axiosClient.get('/users');
      // Kullanıcı verilerini uygun formata dönüştür
      const formattedUsers = response.data.map((user: any) => ({
        value: user.id, // Seçenek değeri
        label: user.fullname, // Seçenek etiketi
      }));
      console.log('Kullanıcılar:', formattedUsers);
      setUsers(formattedUsers); // Kullanıcıları state'e ata
    } catch (error) {
      console.error('Kullanıcı listesi alınamadı', error);
    }
  }, []);

  // Kullanıcıları backend'den çek
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const { toast } = useToast(); // Toast fonksiyonunu al

  const onSubmit = async (data: any) => {
    console.log('Form Verileri:', data); // Form verilerini kontrol et
    // owners alanının boş olup olmadığını kontrol et
    if (!data.owners || data.owners.length === 0) {
      console.error('Owners alanı boş!'); // Hata mesajı
      return; // Formu gönderme
    }
    try {
      await axiosClient.post('/tasks/create', {
        description: data.description,
        ownerIds: data.owners.map(Number), // Seçilen kullanıcıları number olarak atıyoruz
      });

      reset();
      onTaskCreated();
      toast({
        // Başarılı bildirim
        title: 'Task Created',
        description: 'Your task has been created successfully.',
      });
    } catch (error) {
      console.error('Task oluşturulamadı', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                  <Input
                    id="description"
                    {...field}
                    placeholder="Enter task description"
                  />
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
                  {...field}
                  options={users} // Kullanıcıları seçenek olarak veriyoruz
                  selected={field.value || []} // Seçilen sahipleri register ile bağlıyoruz
                  onChange={(value) => {
                    console.log('Seçilen Değerler:', value); // Seçilen değerleri kontrol et
                    field.onChange(value); // Seçim değiştiğinde form değerini güncelliyoruz
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
