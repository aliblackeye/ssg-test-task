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

interface SignInFormData {
  email: string;
  password: string;
}

export const SignIn = () => {
  const { register, handleSubmit } = useForm<SignInFormData>();
  const { setUser } = useAuthContext();
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (data: SignInFormData) => {
    try {
      const response = await axios.post('http://localhost:4000/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { access_token } = response.data;

      if (access_token) {
        localStorage.setItem('access_token', access_token);
        setUser(response.data);
        router.push('/');
        router.reload();
      } else {
        throw new Error('No access token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials');
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
