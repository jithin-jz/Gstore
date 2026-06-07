"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface SignupModalProps {
  onClose: () => void;
}

export function SignupModal({ onClose }: SignupModalProps) {
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="modal-scrim"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-card">
        <button
          type="button"
          className="btn-icon-circular absolute right-4 top-4"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-triangle" />
          </span>
          <span className="text-sm font-semibold text-[var(--ink)]">
            GitHub Store
          </span>
        </div>

        <p className="mono-label mt-8">EARLY ACCESS</p>
        <h2 id="modal-title" className="type-heading-xl mt-2">
          Create your catalog account.
        </h2>
        <p className="type-body-md mt-3 text-[var(--body-text)]">
          Save app lists, track releases, and receive platform-specific install
          recommendations.
        </p>

        <form onSubmit={(event) => event.preventDefault()} className="mt-6 grid gap-4">
          <div>
            <label htmlFor="modal-email" className="type-body-sm font-medium text-[var(--ink)]">
              Email
            </label>
            <input
              ref={emailRef}
              id="modal-email"
              type="email"
              className="text-input mt-2"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="modal-password" className="type-body-sm font-medium text-[var(--ink)]">
              Password
            </label>
            <input
              id="modal-password"
              type="password"
              className="text-input mt-2"
              placeholder="Create a password"
              autoComplete="new-password"
            />
          </div>

          <button id="modal-continue-btn" type="submit" className="btn-primary mt-2 w-full">
            Continue
          </button>
        </form>

        <p className="type-body-sm mt-5 text-center text-[var(--body-text)]">
          Already have access?{" "}
          <button
            type="button"
            className="link-inline bg-transparent p-0"
            onClick={onClose}
          >
            Log in
          </button>
        </p>

        <p className="mt-4 text-center text-xs leading-5 text-[var(--mute)]">
          By continuing you agree to GitHub Store&apos;s{" "}
          <a href="#" className="link-inline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="link-inline">
            Privacy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
