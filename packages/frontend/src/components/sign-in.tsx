import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuthContext } from '@/context/auth-context';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import axiosClient from '@/utils/axiosClient';

interface SignInFormData {
  email: string;
  password: string;
}

export const SignIn = () => {
  const { register, handleSubmit } = useForm<SignInFormData>();
  const { setUser } = useAuthContext();
  const [error] = useState('');
  const router = useRouter();

  const onSubmit = async (data: SignInFormData) => {
    try {
      const response = await axiosClient.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      // Eğer backend cookie'yi ayarlıyorsa, burada başka bir işlem yapmanıza gerek yok
      setUser(response.data); // Kullanıcıyı ayarlayın
      router.push('/');
      router.reload();
    } catch (err) {
      // Hata yakalama kodu
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: true })}
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <CardFooter>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </CardFooter>
          </form>
          <p className="text-center mt-4">
            {`Don't have an account?`}{' '}
            <Link href="/sign-up" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
