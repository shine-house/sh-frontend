import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { addDays, parse, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

 export const getNextDay = (endDate: string) => {

  return format(
    addDays(
      parse(endDate, "yyyy-MM-dd", new Date()),
      1
    ),
    "dd 'de' MMMM",
    { locale: ptBR }
  )
}