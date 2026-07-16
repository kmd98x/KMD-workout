"use client";

export function ConfirmDialog({
  open,
  message,
  danger,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  message: string;
  danger?: boolean;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/62 p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-85 rounded-2xl border border-line bg-surface p-5.5">
        <p className="mb-5 text-[15px] leading-snug text-ink">{message}</p>
        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[10px] bg-surface-2 px-4.5 py-2.75 text-sm font-bold text-ink cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-[10px] px-4.5 py-2.75 text-sm font-bold text-white cursor-pointer ${
              danger ? "bg-danger" : "bg-blue"
            }`}
          >
            {confirmLabel ?? (danger ? "Delete" : "OK")}
          </button>
        </div>
      </div>
    </div>
  );
}
