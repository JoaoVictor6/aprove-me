"use client";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreatePayableSchema } from "../../payable.schema";
import { CreatePayableForm } from "./CreatePayableForm";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Page() {
  const form = useForm<z.infer<typeof CreatePayableSchema>>({
    criteriaMode: 'all',
    values: {
      assignor: "",
      emissionDate: "",
      value: "",
    },
    resolver: zodResolver(CreatePayableSchema)
  });
  return (
    <section className="min-h-screen grid place-content-center">
      <section className="grid ">
        <Form {...form}>
          <CreatePayableForm />
        </Form>
      </section>
    </section>
  );
}
