import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { Input } from "../ui/input";

export interface Field {
    name: string;
    label: string;
    type?: string;
    value: string | number;
}

interface UpdateModalProps {
    fields: Field[];
    setFields: (updateFields: Field[]) => void;
    onSubmit: () => void;
    title: string;
    description?: string;
}

export function UpdateModal({
    fields, 
    setFields,
    onSubmit,
    title,
    description
}: UpdateModalProps) {
    const [open, setOpen] = useState(false);

    const handleChange = (name: string, value: string) => {
        setFields(
            fields.map((field) => 
            field.name === name ? {...field, value} : field)
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer" variant="outline" size="icon" onClick={() => setOpen(true)}>
                    <Pencil className="w-4 h-4 " />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                    setOpen(false);
                }}
                className="space-y-4"
                >
                    {fields.map((field) => (
                        <div key={field.name} className="flex flex-col gap-1">
                            <label htmlFor={field.name} className="text-sm font-medium">
                                {field.label}
                            </label>
                            <Input
                            id={field.name}
                            type={field.type || "text"}
                            value={field.value}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            />
                        </div>
                    ))}

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="cursor-pointer" type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}