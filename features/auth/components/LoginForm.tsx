"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export function LoginForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        const formData = new FormData(e.currentTarget);
        formData.set("flow", flow);
        signIn("password", formData)
          .catch(() => {
            setError(
              flow === "signIn"
                ? "Invalid email or password."
                : "Could not create account. Try a different email."
            );
          })
          .finally(() => setSubmitting(false));
      }}
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-semibold text-muted" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-base text-ink outline-none focus:border-blue"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-semibold text-muted" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete={flow === "signIn" ? "current-password" : "new-password"}
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-base text-ink outline-none focus:border-blue"
        />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-2xl bg-blue py-4 text-[15.5px] font-bold text-white disabled:opacity-40"
      >
        {flow === "signIn" ? "Sign in" : "Create account"}
      </button>
      <button
        type="button"
        onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
        className="text-[13.5px] font-semibold text-blue"
      >
        {flow === "signIn"
          ? "New here? Create an account"
          : "Already have an account? Sign in"}
      </button>
    </form>
  );
}
