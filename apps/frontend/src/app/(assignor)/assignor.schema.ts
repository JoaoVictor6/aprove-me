import { z } from 'zod'

export const DOCUMENT_REQUIRED_ERROR = "Adicione seu CPF ou CNPJ"
export const EMAIL_INVALID_ERROR = "Adicione um email válido"
export const PHONE_REQUIRED_ERROR = "Adicione um telefone válido"
export const NAME_REQUIRED_ERROR = "Adicione um nome ou razão social"
export const AssignorSchema = z.object({
  id: z.string().uuid().readonly(),
  document: z.string({ required_error: DOCUMENT_REQUIRED_ERROR }).max(30).readonly(),
  email: z.string().email({message: EMAIL_INVALID_ERROR}).readonly(),
  phone: z.string({ required_error: PHONE_REQUIRED_ERROR }).max(20).readonly(),
  name: z.string({ required_error: NAME_REQUIRED_ERROR }).readonly()
})