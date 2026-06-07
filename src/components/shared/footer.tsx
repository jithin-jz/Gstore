const FOOTER_COLUMNS = [
  {
    heading: "Explore",
    links: [
      { label: "Developer Tools", href: "#catalog" },
      { label: "AI Tools", href: "#catalog" },
      { label: "Security", href: "#catalog" },
      { label: "Self-hosted", href: "#catalog" },
    ],
  },
  {
    heading: "Platforms",
    links: [
      { label: "Windows", href: "#catalog" },
      { label: "macOS", href: "#catalog" },
      { label: "Linux", href: "#catalog" },
      { label: "Web apps", href: "#catalog" },
    ],
  },
  {
    heading: "Product",
    links: [
      { label: "Catalog", href: "#catalog" },
      { label: "API", href: "#catalog" },
      { label: "Release index", href: "#catalog" },
      { label: "GitHub source", href: "https://github.com", target: "_blank" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Help", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer-section">
      <div className="page-container">
        <div className="footer-grid">
          <div>
            <div className="flex items-center gap-3">
              <span className="brand-mark" aria-hidden="true">
                <span className="brand-triangle" />
              </span>
              <span className="text-sm font-semibold text-[var(--ink)]">
                GitHub Store
              </span>
            </div>
            <p className="type-body-sm mt-4 max-w-xs text-[var(--body-text)]">
              A clean discovery surface for open-source applications, release
              assets, and deployable projects indexed from GitHub.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="footer-heading">{column.heading.toUpperCase()}</h3>
              <ul className="mt-4 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.target}
                      rel={link.target ? "noopener noreferrer" : undefined}
                      className="footer-link"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--hairline)] pt-6 text-xs text-[var(--mute)] sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 GitHub Store.</p>
          <p className="mono-label">LIVE INDEX · RELEASE-AWARE · OPEN SOURCE</p>
        </div>
      </div>
    </footer>
  );
}
