import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Vercel-inspired design tokens */
        ink:                "var(--ink)",
        body:               "var(--body-text)",
        mute:               "var(--mute)",
        canvas:             "var(--canvas)",
        "surface-soft":     "var(--surface-soft)",
        "surface-card":     "var(--surface-card)",
        "surface-inset":    "var(--surface-inset)",
        "surface-dark":     "var(--surface-dark)",
        "secondary-bg":     "var(--secondary-bg)",
        "secondary-pressed":"var(--secondary-pressed)",
        hairline:           "var(--hairline)",
        "hairline-strong":  "var(--hairline-strong)",
        link:               "var(--link)",
        cyan:               "var(--cyan)",
        violet:             "var(--violet)",
        pink:               "var(--highlight-pink)",

        /* ── Shadcn compat ── */
        border:             "var(--hairline)",
        input:              "var(--hairline)",
        ring:               "var(--focus-outer)",
        background:         "var(--surface-soft)",
        foreground:         "var(--ink)",
        primary: {
          DEFAULT:          "var(--primary)",
          foreground:       "var(--on-primary)",
        },
        secondary: {
          DEFAULT:          "var(--secondary-bg)",
          foreground:       "var(--ink)",
        },
        destructive: {
          DEFAULT:          "var(--error)",
          foreground:       "var(--on-primary)",
        },
        muted: {
          DEFAULT:          "var(--surface-inset)",
          foreground:       "var(--body-text)",
        },
        accent: {
          DEFAULT:          "var(--surface-inset)",
          foreground:       "var(--ink)",
        },
        popover: {
          DEFAULT:          "var(--canvas)",
          foreground:       "var(--ink)",
        },
        card: {
          DEFAULT:          "var(--canvas)",
          foreground:       "var(--ink)",
        },
      },
      borderRadius: {
        xs:   "4px",
        sm:   "6px",
        md:   "8px",
        lg:   "12px",
        xl:   "16px",
        pill: "100px",
        full: "9999px",
      },
      fontFamily: {
        display: ["var(--font-geist-sans)", "-apple-system", "system-ui", "sans-serif"],
        sans:    ["var(--font-geist-sans)", "-apple-system", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
        mono:    ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
