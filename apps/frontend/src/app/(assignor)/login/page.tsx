"use client"
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { authAssignor } from '../api/assignor';


const loginSchema = z.object({
  login: z.string({ required_error: "Adicione um login válido" }).min(1, { message: "Adicione um login válido" }),
  password: z.string({ required_error: "Adicione uma senha válida" }).min(1, { message: "Adicione uma senha válida" })
})

const formFields: Array<{ name: keyof z.infer<typeof loginSchema>, label: string, type?: string }> = [
  {
    name: 'login',
    label: 'Login'
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password'
  }
]

export default function Page() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: '',
      password: ''
    }
  })
  
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    await authAssignor(values)
  }

  return (
    <section className='min-h-screen grid place-content-center'>
    <section className='grid '>
      <Form {...form}>
        <form aria-describedby='login' onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {formFields.map(({ name, label, type }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input type={type || 'text'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          ))}
          <Button className='w-full' type="submit">Submit</Button>
        </form>
      </Form>
    </section>
    </section>
  )
}

