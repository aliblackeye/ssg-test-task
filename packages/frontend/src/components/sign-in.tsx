import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuthContext } from '@/context/auth-context';
import { useState } from 'react';
import { useRouter } from 'next/router';

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

      // Token'ı localStorage'a kaydet
      localStorage.setItem('access_token', access_token);

      // Kullanıcıyı güncelle
      setUser(data.email);

      // Giriş başarılı, tasks sayfasına yönlendir
      router.push('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input {...register('email', { required: true })} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register('password', { required: true })} />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Sign In</button>
    </form>
  );
};
