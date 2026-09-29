/* Re-mounts on every navigation, so each route fades in with a short rise (CSS, no JS needed).
 * Disabled for reduced motion in site.css. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
