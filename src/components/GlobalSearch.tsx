"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Loader2, FileText, ShoppingBag, HelpCircle, User } from "lucide-react";
import { fetchSearchIndexAction } from "@/lib/actions/search";
import { ADMIN_PAGES, type SearchResultItem } from "@/lib/search-data";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface GroupedResults {
  pages: SearchResultItem[];
  products: SearchResultItem[];
  faqs: SearchResultItem[];
  farmers: SearchResultItem[];
}

const ICONS = {
  page: FileText,
  product: ShoppingBag,
  faq: HelpCircle,
  farmer: User,
};

const LABELS = {
  page: "Páginas",
  product: "Productos",
  faq: "Preguntas frecuentes",
  farmer: "Agricultores",
};

function fuzzyMatch(text: string, q: string) {
  return text.toLowerCase().includes(q.toLowerCase());
}

export default function GlobalSearch() {
  const router = useRouter();
  const { profile } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [data, setData] = useState<GroupedResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const isAdmin = profile?.role === "admin";

  // Cargar índice una sola vez al abrir
  useEffect(() => {
    if (!open || data) return;
    setLoading(true);
    fetchSearchIndexAction()
      .then(setData)
      .finally(() => setLoading(false));
  }, [open, data]);

  // Abrir con Cmd/Ctrl + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Enfocar input al abrir
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setActiveIdx(0);
    }
  }, [open]);

  // Resultados filtrados
  const filtered = useMemo(() => {
    if (!data) return null;
    const allPages = [
      ...data.pages,
      ...(isAdmin ? ADMIN_PAGES : []),
    ];
    const search = query.trim();
    if (!search) {
      // Sin query: muestra páginas estáticas como quick access
      return {
        pages: allPages.slice(0, 5),
        products: [],
        faqs: [],
        farmers: [],
        _flat: allPages.slice(0, 5),
      };
    }
    const pages = allPages.filter((p) => fuzzyMatch(p.title, search));
    const products = data.products.filter(
      (p) => fuzzyMatch(p.title, search) || fuzzyMatch(p.subtitle ?? "", search)
    );
    const faqs = data.faqs.filter(
      (f) => fuzzyMatch(f.title, search) || fuzzyMatch(f.subtitle ?? "", search)
    );
    const farmers = data.farmers.filter((f) =>
      fuzzyMatch(f.title, search) || fuzzyMatch(f.subtitle ?? "", search)
    );
    // Construir lista plana para navegación con teclado
    const flat = [...pages, ...products, ...faqs, ...farmers].slice(0, 8);
    return { pages, products, faqs, farmers, _flat: flat };
  }, [data, query, isAdmin]);

  // Reset índice cuando cambia query
  useEffect(() => setActiveIdx(0), [query]);

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filtered?._flat.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered._flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filtered._flat[activeIdx];
      if (target) {
        router.push(target.href);
        setOpen(false);
      }
    }
  };

  if (!open) return <TriggerButton onClick={() => setOpen(true)} />;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-24"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-cream-200 px-4 py-3">
          <Search size={18} className="text-stone-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar páginas, productos, agricultores..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-stone-400"
          />
          {loading && <Loader2 size={16} className="animate-spin text-stone-400" />}
          <kbd className="hidden rounded border border-cream-200 bg-cream-50 px-1.5 py-0.5 text-[10px] text-stone-500 sm:inline">
            ESC
          </kbd>
        </div>

        <div ref={resultsRef} className="max-h-96 overflow-y-auto py-2">
          {!filtered ? (
            <EmptyState loading />
          ) : filtered._flat.length === 0 ? (
            <EmptyState message="Sin resultados. Probá con otra palabra." />
          ) : (
            <Results
              data={filtered}
              activeIdx={activeIdx}
              onSelect={(r) => {
                router.push(r.href);
                setOpen(false);
              }}
              isAdmin={isAdmin}
            />
          )}
        </div>

        <div className="border-t border-cream-200 bg-cream-50 px-4 py-2 text-[11px] text-stone-500">
          <span className="mr-3">↑↓ navegar</span>
          <span className="mr-3">↵ abrir</span>
          <span className="mr-3">esc cerrar</span>
        </div>
      </div>
    </div>
  );
}

function TriggerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Buscar"
      className="flex items-center gap-2 rounded-xl border border-cream-200 bg-cream-50 px-3 py-2 text-xs text-stone-500 transition hover:border-agro-300 hover:bg-white"
    >
      <Search size={14} />
      <span className="hidden md:inline">Buscar...</span>
      <kbd className="hidden rounded border border-cream-200 bg-white px-1.5 py-0.5 text-[10px] text-stone-500 sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}

function EmptyState({ message, loading }: { message?: string; loading?: boolean }) {
  return (
    <div className="px-6 py-10 text-center text-sm text-stone-500">
      {loading ? (
        <Loader2 size={20} className="mx-auto animate-spin" />
      ) : (
        message ?? "Empezá a escribir para buscar."
      )}
    </div>
  );
}

function Results({
  data,
  activeIdx,
  onSelect,
  isAdmin,
}: {
  data: NonNullable<ReturnType<typeof useMemo<GroupedResults | null>>> & {
    _flat: SearchResultItem[];
  };
  activeIdx: number;
  onSelect: (r: SearchResultItem) => void;
  isAdmin?: boolean;
}) {
  // Calculamos índices planos por grupo para saber si un item está activo
  const active = data._flat[activeIdx];
  const renderGroup = (
    label: string,
    items: SearchResultItem[]
  ): React.ReactNode => {
    if (items.length === 0) return null;
    return (
      <div className="py-1">
        <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
          {label}
        </p>
        {items.map((it) => {
          const Icon = ICONS[it.type];
          const isActive = active?.href === it.href;
          return (
            <button
              key={it.href + it.title}
              type="button"
              onClick={() => onSelect(it)}
              className={`flex w-full items-center gap-3 px-4 py-2 text-left transition ${
                isActive ? "bg-agro-50 text-agro-800" : "text-stone-700 hover:bg-cream-50"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  isActive ? "bg-agro-600 text-white" : "bg-cream-100 text-stone-500"
                }`}
              >
                <Icon size={14} />
              </span>
              <span className="min-w-0 flex-1 truncate">
                <span className="block truncate text-sm font-semibold">
                  {it.title}
                </span>
                {it.subtitle && (
                  <span className="block truncate text-xs text-stone-500">
                    {it.subtitle}
                  </span>
                )}
              </span>
              <ArrowRight size={14} className="text-stone-300" />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {renderGroup("Páginas", data.pages)}
      {renderGroup("Productos", data.products)}
      {renderGroup("Agricultores", data.farmers)}
      {renderGroup("Preguntas frecuentes", data.faqs)}
      {isAdmin && renderGroup("Administración", ADMIN_PAGES)}
    </>
  );
}