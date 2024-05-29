"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
  description,
  onChange,
  value,
}: {
  description: string;
  onChange?: (dateString: string) => void;
  value?: string;
}) {
  const [date, setDate] = React.useState<Date | undefined>(() =>
    value ? new Date(value) : undefined
  );

  return (
    <Popover>
      <PopoverTrigger asChild className="flex">
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{description}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            if (!date) return;
            setDate(date);
            onChange?.(date.toISOString());
          }}
          initialFocus
          lang="pt-BR"
        />
      </PopoverContent>
    </Popover>
  );
}
