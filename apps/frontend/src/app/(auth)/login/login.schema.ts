import { z } from "zod";

export const ADD_VALID_LOGIN_MESSAGE = "Adicione um login válido";
export const ADD_VALID_PASSWORD_MESSAGE = "Adicione uma senha válida";
export const loginSchema = z.object({
  login: z
    .string({ required_error: "Adicione um login válido" })
    .min(1, { message: ADD_VALID_LOGIN_MESSAGE }),
  password: z
    .string({ required_error: "Adicione uma senha válida" })
    .min(1, { message: ADD_VALID_PASSWORD_MESSAGE }),
});