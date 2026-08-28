import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Migas de pan" className="text-xs text-stone-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-agro-700 hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-semibold text-stone-700" : ""}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight size={12} className="text-stone-400" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}