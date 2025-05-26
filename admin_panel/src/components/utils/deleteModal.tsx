import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";

interface DeleteModalProps{
    setConfirmInput: (text: string) => void;
    confirmInput: string;
    valueToConfirm: string;
    handleDelete: () => void;
    item_name: string;
    className?: string;
}

export function DeleteModal({
    confirmInput,
    valueToConfirm,
    handleDelete,
    setConfirmInput,
    item_name,
    className,
    
}: DeleteModalProps) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            <Button
                className={`cursor-pointer ${className || ""}`}
                variant="destructive"
                size="icon"
                onClick={() => {
                setConfirmInput("");
                }}
            >
                <Trash2 className="w-4 h-4" />
            </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete {item_name}</DialogTitle>
                <DialogDescription>
                This operation is irreversible. Enter {item_name} name to confirm: <strong>{valueToConfirm}</strong>
                </DialogDescription>
            </DialogHeader>

            <Input
                placeholder={`Enter: ${valueToConfirm}`}
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
            />

            <DialogFooter>
                <Button
                variant="ghost"
                onClick={() => {
                    setConfirmInput("");
                    setOpen(false);
                }}
                >
                Cancel
                </Button>
                <Button
                variant="destructive"
                disabled={confirmInput !== valueToConfirm}
                onClick={() => {
                    handleDelete()
                    setOpen(false);
                }}
                >
                Delete
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}