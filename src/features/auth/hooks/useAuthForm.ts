// features/auth/hooks/useAuthForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema } from '../schemas/authSchema';
import type { LoginFormData, RegisterFormData } from '../schemas/authSchema';

export const useLoginForm = () => {
  return useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email:    '',
      password: '',
    },
  });
};

export const useRegisterForm = () => {
  return useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email:           '',
      username:        '',
      displayName:     '',
      password:        '',
      confirmPassword: '',
    },
  });
};