"use client";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { createPayable } from "../../api/createAssignor";
import { CreatePayableSchema } from "../../payable.schema";
import { AssignorCombobox } from '@/app/(assignor)/components/AssignorCombobox'
import { Suspense } from "react";
import { CurrencyInput } from 'react-currency-mask';
import { Input } from "@/components/ui/input";

export function CreatePayableForm() {
  const form = useFormContext<z.infer<typeof CreatePayableSchema>>();
  const toast = useToast();
  const onSubmit = async (values: z.infer<typeof CreatePayableSchema>) => {
    console.log(values)
    const { data, error: errorMessage } = await createPayable(values);

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
        title: "Pagavel criado com sucesso!",
      });
    }
  };
  return (
    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name={"assignor"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cedente</FormLabel>
            <FormControl>
              <Suspense fallback={<AssignorCombobox.Fallback />}>
                <AssignorCombobox onChange={assignorId => form.setValue(field.name, assignorId)} />
              </Suspense>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={"emissionDate"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de emissão</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value}
                onChange={(dateString) =>
                  form.setValue("emissionDate", dateString)
                }
                description=""
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={"value"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor</FormLabel>
            <FormControl>
              <CurrencyInput
                onChangeValue={() => undefined}
                InputElement={<Input {...field} placeholder="Digite o valor aqui" />}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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

