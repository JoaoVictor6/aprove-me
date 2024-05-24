"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { auth } from "../api/auth";
import { loginSchema } from "./login.schema";

const formFields: Array<{
  name: keyof z.infer<typeof loginSchema>;
  label: string;
  type?: string;
}> = [
  {
    name: "login",
    label: "Login",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
  },
];

export function LoginForm() {
  const form = useFormContext<z.infer<typeof loginSchema>>()
  const toast = useToast();
  const setAuthToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const { data, error: errorMessage } = await auth(values);

    if (errorMessage) {
      toast.toast({
        title: "Ocorreu um erro!",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }
    if (data) {
      setAuthToken(data.token);
      toast.toast({
        title: "Login feito com sucesso!",
      });
      router.push("/");
    }
  };
  return (
    <form
      aria-describedby="login"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
    >
      {formFields.map(({ name, label, type }) => (
        <FormField
          key={name}
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input type={type || "text"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <Button
        disabled={form.formState.isSubmitting}
        className="w-full"
        type="submit"
      >
        Submit
      </Button>
    </form>
  );
}
