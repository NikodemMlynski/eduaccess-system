import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";

interface DeleteModalProps{
    setConfirmInput: (text: string) => void;
    confirmInput: string;
    valueToConfirm: string;
    handleDelete: () => void;
}

export function DeleteModal({
    confirmInput,
    valueToConfirm,
    handleDelete,
    setConfirmInput,
    
}: DeleteModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
            <Button
                className="cursor-pointer"
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
                <DialogTitle>Usuń pokój</DialogTitle>
                <DialogDescription>
                Ta operacja jest nieodwracalna. Aby potwierdzić, wpisz nazwę pokoju: <strong>{valueToConfirm}</strong>
                </DialogDescription>
            </DialogHeader>

            <Input
                placeholder={`Wpisz: ${valueToConfirm}`}
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
            />

            <DialogFooter>
                <Button
                variant="ghost"
                onClick={() => {
                    setConfirmInput("");
                }}
                >
                Anuluj
                </Button>
                <Button
                variant="destructive"
                disabled={confirmInput !== valueToConfirm}
                onClick={handleDelete}
                >
                Usuń
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}