// utils/showConfirmDialog.tsx
import { createRoot } from "react-dom/client";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { useState } from "react";

export function showConfirmDialog({
  title,
  description,
}: {
  title: string;
  description: string;
}): Promise<{
  confirmed: boolean;
  setPending: (isPending: boolean) => void;
  close: () => void;
}> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    // Function to remove dialog from DOM
    const cleanup = () => {
      root.unmount();
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };

    // Use DialogComponent to handle state internally
    const DialogComponent = () => {
      const [isPending, setIsPending] = useState(false);

      const handleConfirm = () => {
        resolve({
          confirmed: true,
          setPending: setIsPending,
          close: cleanup,
        });
      };

      const handleCancel = () => {
        if (!isPending) {
          resolve({
            confirmed: false,
            setPending: setIsPending,
            close: cleanup,
          });
        }
      };

      return (
        <ConfirmDialog
          title={title}
          description={description}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isPending={isPending}
        />
      );
    };

    root.render(<DialogComponent />);
  });
}
