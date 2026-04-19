import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
export function ConfirmDialog({
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isPending = false,
}: {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}) {
  const [open, setOpen] = useState(true);

  const handleConfirm = () => {
    onConfirm();
  };

  const requestClose = () => {
    if (isPending) return;
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen && isPending) return;
        if (!isOpen) {
          setOpen(false);
          onCancel();
          return;
        }
        setOpen(isOpen);
      }}
    >
      <DialogContent
        className="py-8 flex flex-col gap-8 rounded-2xl "
        onEscapeKeyDown={(e: any) => {
          if (isPending) e.preventDefault();
        }}
        onPointerDownOutside={(e: any) => {
          if (isPending) e.preventDefault();
        }}
      >
        <DialogHeader className="flex flex-col gap-4">
          <div className="h-20 w-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
            <Trash2 className="text-destructive" size={30} />
          </div>
          <DialogTitle className="text-center text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-center text-lg">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mx-auto grid grid-cols-2 gap-2 w-full ">
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              confirmText
            )}
          </Button>
          <Button variant="outline" onClick={requestClose} disabled={isPending}>
            {cancelText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
