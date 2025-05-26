import {ReactNode} from "react";
import {Select, SelectContent, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Calendar} from "@/components/ui/calendar"

interface LessonInstanceSelectProps {
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
    content: ReactNode;
    onValueChange: (val: string) => void;
    onButtonClick: () => void;
    label: string;
    date: Date | null,
    setDate: (date: Date) => void;
}

const LessonInstanceSelect = ({
    isLoading,
    isError,
    errorMessage,
    content,
    onValueChange,
    onButtonClick,
    label,
    date,
    setDate
}: LessonInstanceSelectProps) => {
  return (
      <div className="flex flex-row justify-between w-[450px] px-5 py-2 items-center">

          <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border scale-[85%]"
              />
          <div className="flex flex-col items-center justify-between gap-10 p-2 w-[200px]">

          <h3>{label}</h3>
          <Select onValueChange={onValueChange}>
              {
                isLoading ? <Loader2 className="h-10 w-10 animate-spin text-primary" /> : (
                    isError ? <p>{errorMessage}</p> : (
                    <>
                        <SelectTrigger>
                            <SelectValue placeholder="Szukaj klasę"/>
                        </SelectTrigger>
                        <SelectContent>
                            {content}
                        </SelectContent>
                    </>
                    )
                )
              }
          </Select>
            <Button onClick={onButtonClick} className="cursor-pointer w-full">Szukaj</Button>

          </div>
      </div>
  )
}

export default LessonInstanceSelect;