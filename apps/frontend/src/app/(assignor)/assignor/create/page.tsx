"use client";
import {
  Form
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AssignorSchema } from "../../assignor.schema";
import { AssignorForm } from "./AssignorForm";

const assignorCreateSchema = AssignorSchema.omit({ id: true });

export default function Page() {
  const form = useForm<z.infer<typeof assignorCreateSchema>>({
    resolver: zodResolver(assignorCreateSchema),
    defaultValues: {
      document: "",
      email: "",
      name: "",
      phone: "",
    },
  });

  return (
    <section className="min-h-screen grid place-content-center">
      <section className="grid ">
        <Form {...form}>
          <AssignorForm />
        </Form>
      </section>
    </section>
  );
}
