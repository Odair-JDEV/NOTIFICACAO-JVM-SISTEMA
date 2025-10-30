import { z } from "zod";

export const irregularitySchema = z.object({
  municipio: z.string(),
  numFormulario: z.string(),
  numeroPoste: z.string(),
  operadora: z.string(),
  irregularidade: z.string(),
  vencidas: z.number(),
  noPrazo: z.string(),
  emailEnviado: z.string(),
  dataEnvioEmail: z.string(),
  regularizado: z.string(),
  statusVerificacao: z.enum(["normal", "aguardando_verificacao_jvm"]),
  emCampo: z.string(),
  bairro: z.string(),
  logradouro: z.string(),
  numLogradouro: z.string(),
});

export type Irregularity = z.infer<typeof irregularitySchema>;

export interface ChartData {
  mes: string;
  semana1: number | null;
  semana2: number | null;
  semana3: number | null;
  semana4: number | null;
}
