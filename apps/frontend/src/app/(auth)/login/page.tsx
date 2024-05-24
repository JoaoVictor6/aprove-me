"use client"
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LoginForm } from './LoginForm';
import { loginSchema } from './login.schema';


export default function Page() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });
  return (
    <section className='min-h-screen grid place-content-center'>
    <section className='grid '>
      <Form {...form}>
        <LoginForm />
      </Form>
    </section>
    </section>
  )
}

