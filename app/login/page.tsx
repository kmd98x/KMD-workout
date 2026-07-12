import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] flex-col justify-center py-10">
      <div className="mb-8 text-center">
        <div className="text-[26px] font-extrabold tracking-tight">
          <span className="text-blue">Steady</span>
        </div>
        <p className="mt-1 text-[12.5px] text-muted-2">
          Sign in to keep your workouts in sync.
        </p>
      </div>
      <div className="mx-auto w-full max-w-85 rounded-card bg-surface p-6">
        <LoginForm />
      </div>
    </div>
  );
}
