import {ReactNode} from "react";
import {Select, SelectContent, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";

interface LessonTemplateSelectProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  content: ReactNode;
  onValueChange: (val: string) => void;
  onButtonClick: () => void;
  label: string;
  isSearch?: boolean;
  defaultValue?: number | null;
  isLabelHidden?: boolean;
}

const LessonTemplateSelect = ({
    isLoading,
    isError,
    errorMessage,
    content,
    onValueChange,
    onButtonClick,
    label,
    isSearch = true,
    defaultValue,
    isLabelHidden,
}: LessonTemplateSelectProps) => {
  return (
      <div className={`flex justify-between ${isLabelHidden ? "" : "w-[400px]"} px-5 py-2 items-center`}>
          {!isLabelHidden && (<Label>{label}</Label>)}
          <Select
              onValueChange={onValueChange}
              {...(defaultValue !== undefined ? { defaultValue: `${defaultValue}` } : {})}
          >
              {
                isLoading ? <Loader2 className="h-10 w-10 animate-spin text-primary" /> : (
                    isError ? <p>{errorMessage}</p> : (
                    <>
                        <SelectTrigger>
                            <SelectValue placeholder="Wybierz"/>
                        </SelectTrigger>
                        <SelectContent>
                            {content}
                        </SelectContent>
                    </>
                    )
                )
              }
          </Select>
          {isSearch && (<Button onClick={onButtonClick} className="cursor-pointer">Szukaj</Button>)}
      </div>
  )
}

export default LessonTemplateSelect;