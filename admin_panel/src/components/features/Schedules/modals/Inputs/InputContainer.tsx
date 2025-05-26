import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";

interface InputContainerProps {
  register: any;
  errors: any;
  label: string;
  name: keyof LessonTemplateFormData;
}

export const InputContainer = ({
    register,
    errors,
    name,
    label,
    ...props
}: InputContainerProps) => {
  return (
       <div>
          <Label className="pb-1" htmlFor={name}>{label}</Label>
          <Input {...props} id={name} {...register(name)} />
          {errors[name] && (
            <p className="text-sm text-red-500 mt-1">
              {errors[name]?.message as string}
            </p>
          )}
        </div>
  )
}