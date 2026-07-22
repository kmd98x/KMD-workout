import { ArrowLeft, ChevronDown, ChevronUp, Check, Clock, Dumbbell, HeartPulse, Trash2, X } from "lucide-react";

export function BackIcon() {
  return <ArrowLeft className="h-5.5 w-5.5" strokeWidth={2} />;
}

export function ChevronDownIcon() {
  return <ChevronDown className="h-5.5 w-5.5" strokeWidth={2} />;
}

export function ChevronUpIcon() {
  return <ChevronUp className="h-5 w-5 shrink-0 text-muted-2" strokeWidth={2} />;
}

export function CloseIcon() {
  return <X className="h-5.5 w-5.5" strokeWidth={2} />;
}

export function ClockIcon() {
  return <Clock width={17} height={17} strokeWidth={2} className="mt-0.5 shrink-0 text-blue" />;
}

export function CheckIcon() {
  return <Check className="h-3.75 w-3.75" strokeWidth={3} />;
}

/** Shared by `QuickStartButton`, `SessionHistoryList`'s type badge, etc. —
 * anywhere a session/action needs a strength-vs-cardio glyph. */
export function StrengthIcon() {
  return <Dumbbell className="h-6 w-6" strokeWidth={1.8} />;
}

export function TrashIcon() {
  return <Trash2 className="h-5 w-5" strokeWidth={2} />;
}

export function CardioIcon() {
  return <HeartPulse className="h-6 w-6" strokeWidth={1.8} />;
}
