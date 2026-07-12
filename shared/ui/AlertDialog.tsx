"use client";

export function AlertDialog({
  open,
  message,
  onClose,
}: {
  open: boolean;
  message: string;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/62 p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[340px] rounded-2xl border border-line bg-surface p-[22px]">
        <p className="mb-5 text-[15px] leading-snug text-ink">{message}</p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] bg-blue px-[18px] py-[11px] text-sm font-bold text-white"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
