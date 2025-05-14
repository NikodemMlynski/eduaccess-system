import {ReactNode} from "react";
import {Select, SelectContent, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

interface LessonTemplateSelectProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  content: ReactNode;
  onValueChange: (val: string) => void;
  onButtonClick: () => void;
  label: string;
}

const LessonTemplateSelect = ({
    isLoading,
    isError,
    errorMessage,
    content,
    onValueChange,
    onButtonClick,
    label
}: LessonTemplateSelectProps) => {
  return (
      <div className="flex justify-between w-[400px] px-5 py-2 items-center">
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
            <Button onClick={onButtonClick} className="cursor-pointer">Szukaj</Button>
      </div>
  )
}

export default LessonTemplateSelect;