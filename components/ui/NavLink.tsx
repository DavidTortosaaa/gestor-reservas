import Link from "next/link";

export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-foreground hover:text-blue-600 transition-colors"
    >
      {children}
    </Link>
  );
}