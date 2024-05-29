import { z } from "zod";

export const INVALID_ASSIGNOR_ID = "Cedente inválido";
export const INVALID_EMISSION_DATE = "Data de emissão inválida";
export const INVALID_VALUE = "Insira um valor válido";
export const PayableSchema = z.object({
  id: z.string().uuid(),
  assignor: z.string().min(1, { message: INVALID_ASSIGNOR_ID }).uuid({ message: INVALID_ASSIGNOR_ID }),
  emissionDate: z.string().min(1, { message: INVALID_EMISSION_DATE }).datetime({ message: INVALID_EMISSION_DATE }),
  value: z.number().min(1, { message: INVALID_VALUE }),
});

export const CreatePayableSchema = PayableSchema.omit({ id: true })
