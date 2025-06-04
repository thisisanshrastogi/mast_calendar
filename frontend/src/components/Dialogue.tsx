import * as Dialog from "@radix-ui/react-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({ open, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onCancel}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 z-[80] -translate-y-1/2 bg-gradient-to-r from-blue-50 to-white rounded-3xl p-6 shadow-lg space-y-4 w-[90vw] max-w-sm">
          <Dialog.Title className="text-md font-medium">
            Are you sure you want to log out?
          </Dialog.Title>
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-3 py-1 cursor-pointer border border-slate-200 bg-neutral-100 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-3 py-1 cursor-pointer bg-blue-500 rounded-lg text-white  hover:bg-blue-700"
            >
              Okay
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ConfirmDialog;
