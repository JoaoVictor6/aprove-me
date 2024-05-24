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
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { createAssignor } from "../../api/createAssignor";
import { AssignorSchema } from "../../assignor.schema";

const formFields: Array<{
  name: keyof z.infer<typeof assignorCreateSchema>;
  label: string;
  type?: string;
}> = [
  {
    name: "document",
    label: "CPF/CNPJ",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
  },
  {
    name: "name",
    label: "Nome",
  },
  {
    name: "phone",
    label: "Telefone",
    type: "phone",
  },
];

const assignorCreateSchema = AssignorSchema.omit({ id: true });
export function AssignorForm() {
  const form = useFormContext<z.infer<typeof assignorCreateSchema>>();

  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof assignorCreateSchema>) => {
    const { data, error: errorMessage } = await createAssignor(values);

    if (errorMessage) {
      toast.toast({
        title: "Ocorreu um erro!",
        description: errorMessage.message,
        variant: "destructive",
      });
      return;
    }
    if (data) {
      toast.toast({
        title: "Cedente criado com sucesso!",
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
      <Button className="w-full" type="submit">
        Submit
      </Button>
    </form>
  );
}
