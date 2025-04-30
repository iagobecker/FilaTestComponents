import { parseISO } from "date-fns";
import { differenceInMinutes } from "date-fns";

export function calcularTempo(dataHoraCriado?: string): string {
  if (!dataHoraCriado) return "";
  const criado = typeof dataHoraCriado === "string" ? parseISO(dataHoraCriado) : dataHoraCriado;
  const minutos = differenceInMinutes(new Date(), criado);
  if (minutos < 1) return "Agora";
  if (minutos < 60) return `há ${minutos} minutos`;
  const horas = Math.floor(minutos / 60);
  return `há ${horas}h${(minutos % 60).toString().padStart(2, "0")}`;
}
