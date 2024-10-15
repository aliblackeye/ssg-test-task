import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuthContext } from '@/context/auth-context';
import { useState } from 'react';

interface SignUpFormData {
  email: string;
  password: string;
}

export const SignUp = () => {
  const { register, handleSubmit } = useForm<SignUpFormData>();
  const { setUser } = useAuthContext();
  const [error, setError] = useState('');

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await axios.post('http://localhost:4000/auth/signup', {
        email: data.email,
        password: data.password,
      });

      setUser(data.email); // Kullanıcı bilgilerini güncelle
      setError('');
    } catch (err) {
      setError('Could not create an account');
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
      <button type="submit">Sign Up</button>
    </form>
  );
};
