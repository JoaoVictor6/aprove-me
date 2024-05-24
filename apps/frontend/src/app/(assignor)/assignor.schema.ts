import { z } from "zod";

export const DOCUMENT_REQUIRED_ERROR = "Adicione seu CPF ou CNPJ";
export const EMAIL_INVALID_ERROR = "Adicione um email válido";
export const PHONE_REQUIRED_ERROR = "Adicione um telefone válido";
export const NAME_REQUIRED_ERROR = "Adicione um nome ou razão social";
export const AssignorSchema = z.object({
  id: z.string().uuid(),
  document: z
    .string()
    .min(1, { message: DOCUMENT_REQUIRED_ERROR })
    .max(30),
  email: z.string().email({ message: EMAIL_INVALID_ERROR }).min(1, { message: EMAIL_INVALID_ERROR }),
  phone: z
    .string()
    .min(1, { message: PHONE_REQUIRED_ERROR })
    .max(20),
  name: z.string().min(1, { message: NAME_REQUIRED_ERROR }),
});
