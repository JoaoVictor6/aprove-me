import { z } from 'zod'

export const AssignorSchema = z.object({
  id: z.string().uuid().readonly(),
  document: z.string({ required_error: "Adicione seu CPF ou CNPJ" }).max(30).readonly(),
  email: z.string().email({message: "Adicione um email válido"}).readonly(),
  phone: z.string({ required_error: "Adicione um telefone válido" }).max(20).readonly(),
  name: z.string({ required_error: "Adicione um nome ou razão social" }).readonly()
})