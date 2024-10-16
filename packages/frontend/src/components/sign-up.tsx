import { useForm } from 'react-hook-form';
import { useAuthContext } from '@/context/auth-context';
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
import { useRouter } from 'next/router';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Cookies from 'js-cookie'; // js-cookie kütüphanesini ekleyin
import axiosClient from '@/utils/axiosClient';

interface SignUpFormData {
  fullname: string;
  email: string;
  password: string;
}

export const SignUp = () => {
  const { register, handleSubmit } = useForm<SignUpFormData>();
  const { setUserId } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await axiosClient.post('/auth/register', {
        fullname: data.fullname,
        email: data.email,
        password: data.password,
      });

      // Token'ı cookie'ye setlemek için
      const { access_token } = response.data;

      if (access_token) {
        Cookies.set('access_token', access_token, { expires: 1 });
        setUserId(response.data.id);
        router.push('/tasks');
        toast({
          // Başarılı kayıt bildirim
          title: 'Account Created',
          description: 'Your account has been created successfully.',
        });
      } else {
        throw new Error('Token not received');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        toast({
          title: 'User already exists',
          description: 'Please try logging in or use a different email.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Could not create an account. Please try again.',
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your details below to create a new account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                type="text"
                {...register('fullname', { required: true })}
              />
            </div>
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
            <CardFooter>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </CardFooter>
          </form>
          <p className="text-center mt-4">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
