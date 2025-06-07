import Link from "next/link";
import { LucideIcon } from "lucide-react";

type AccionRapidaProps = {
  href: string;
  icon: LucideIcon;
  bgColor: string;
  children: React.ReactNode;
};

export function AccionRapida({ href, icon: Icon, bgColor, children }: AccionRapidaProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center p-6 text-white rounded-xl shadow hover:opacity-90 transition ${bgColor}`}
    >
      <Icon size={32} />
      <span className="mt-2 text-lg font-medium text-center">{children}</span>
    </Link>
  );
}