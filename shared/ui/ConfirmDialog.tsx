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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/62 p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-[340px] rounded-2xl border border-line bg-surface p-[22px]">
        <p className="mb-5 text-[15px] leading-snug text-ink">{message}</p>
        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[10px] bg-surface-2 px-[18px] py-[11px] text-sm font-bold text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-[10px] px-[18px] py-[11px] text-sm font-bold text-white ${
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
