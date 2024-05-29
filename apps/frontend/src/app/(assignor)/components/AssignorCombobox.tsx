"use client"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { cache, use, useState } from "react"
import { z } from "zod"
import { AssignorSchema } from "../assignor.schema"

const assignorListSchema = AssignorSchema.omit({ email: true, id: true, phone: true });
type AssignorComboboxList = z.infer<typeof assignorListSchema>

const LoadAssignorFallback = () => (
  <Button className="flex gap-2 items-center w-full" variant={"secondary"} disabled>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      className="animate-spin"
    >
      <line x1="12" y1="2" x2="12" y2="6"></line>
      <line x1="12" y1="18" x2="12" y2="22"></line>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
      <line x1="2" y1="12" x2="6" y2="12"></line>
      <line x1="18" y1="12" x2="22" y2="12"></line>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    </svg>
    Carregando cedentes
  </Button>
)

const getAssignors = cache(async () => {
  await new Promise(r => setTimeout(r, 1000))
  return [] as AssignorComboboxList[]
})

export function AssignorCombobox({ onChange }: { onChange?: (assignorId: string) => void }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const assignorList = use(getAssignors());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? assignorList.find((assignor) => assignor.name === value)?.name
            : "Selecione um cedente"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Procure um cedente..." />
          <CommandEmpty>Nenhum cedente encontrado.</CommandEmpty>
          <CommandGroup>
            {assignorList.map((assignor) => (
              <CommandItem
                key={assignor.document}
                value={assignor.name}
                onSelect={(currentValue) => {
                  onChange?.(currentValue)
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === assignor.document ? "opacity-100" : "opacity-0"
                  )}
                />
                {assignor.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

AssignorCombobox.Fallback = LoadAssignorFallback;
