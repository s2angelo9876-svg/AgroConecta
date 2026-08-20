"use client";

import { useMemo, useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { useProducts } from "@/components/ProductsProvider";
import ProductCard from "@/components/ProductCard";
import { findFarmer, PRODUCT_OPTIONS, LOCATIONS } from "@/data/mock";

const inputCls =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-agro-500 focus:ring-2 focus:ring-agro-100";

export default function BuscarPage() {
  const { products } = useProducts();
  const [producto, setProducto] = useState("todos");
  const [ubicacion, setUbicacion] = useState("todas");
  const [calidad, setCalidad] = useState("todas");
  const [precioMax, setPrecioMax] = useState("");

  const results = useMemo(
    () =>
      products.filter(
        (p) =>
          (producto === "todos" || p.name === producto) &&
          (ubicacion === "todas" || p.location === ubicacion) &&
          (calidad === "todas" || p.quality === calidad) &&
          (precioMax === "" || p.price <= Number(precioMax))
      ),
    [products, producto, ubicacion, calidad, precioMax]
  );

  const reset = () => {
    setProducto("todos");
    setUbicacion("todas");
    setCalidad("todas");
    setPrecioMax("");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="flex items-center gap-2 text-2xl font-extrabold text-agro-800">
        <Search className="text-agro-600" /> Buscar productos
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Encuentra cosechas frescas directo del productor.
      </p>

      <div className="mt-6 rounded-2xl border border-cream-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-stone-500">
              Producto
            </label>
            <select
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              className={inputCls}
            >
              <option value="todos">Todos los productos</option>
              {PRODUCT_OPTIONS.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-stone-500">
              Ubicación
            </label>
            <select
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className={inputCls}
            >
              <option value="todas">Todas las ubicaciones</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-stone-500">
              Calidad
            </label>
            <select
              value={calidad}
              onChange={(e) => setCalidad(e.target.value)}
              className={inputCls}
            >
              <option value="todas">Todas las calidades</option>
              <option value="Premium">Premium</option>
              <option value="Primera">Primera</option>
              <option value="Segunda">Segunda</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-stone-500">
              Precio máximo (S/ por kg)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              placeholder="Ej: 5.00"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-500 transition hover:text-agro-700"
          >
            <RotateCcw size={14} /> Limpiar filtros
          </button>
        </div>
      </div>

      <p className="mt-6 text-sm font-semibold text-stone-500">
        Resultados encontrados ({results.length})
      </p>
      {results.length > 0 ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {results.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              farmer={findFarmer(product.farmerId)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center text-sm text-stone-500">
          No hay productos que coincidan con los filtros seleccionados.
        </div>
      )}
    </section>
  );
}
