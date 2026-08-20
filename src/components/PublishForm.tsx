"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import {
  Star,
  Leaf,
  Circle,
  Camera,
  CheckCircle2,
  CloudUpload,
} from "lucide-react";
import {
  PRODUCT_OPTIONS,
  PRODUCT_IMAGES,
  DEFAULT_PRODUCT_IMAGE,
  LOCATIONS,
  type Product,
  type Quality,
} from "@/data/mock";
import { useProducts } from "./ProductsProvider";

const QUALITIES: {
  value: Quality;
  label: string;
  desc: string;
  Icon: typeof Star;
}[] = [
  { value: "Premium", label: "Premium", desc: "La mejor calidad", Icon: Star },
  { value: "Primera", label: "Primera", desc: "Buena calidad", Icon: Leaf },
  { value: "Segunda", label: "Segunda", desc: "Calidad estándar", Icon: Circle },
];

const inputCls =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-agro-500 focus:ring-2 focus:ring-agro-100";

export default function PublishForm({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  const { addProduct } = useProducts();
  const [form, setForm] = useState({
    product: "",
    quantity: "",
    price: "",
    harvestDate: "",
    location: "",
    quality: "Premium" as Quality,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !form.product ||
      !form.quantity ||
      !form.price ||
      !form.harvestDate ||
      !form.location
    ) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    const id = `local-${Date.now()}`;
    const product: Product = {
      id,
      name: form.product,
      quantity: Number(form.quantity),
      unit: "kg",
      price: Number(form.price),
      location: form.location,
      harvestDate: form.harvestDate,
      quality: form.quality,
      image: PRODUCT_IMAGES[form.product] ?? DEFAULT_PRODUCT_IMAGE,
      description: `${form.product} fresco, recién cosechado. Publicado por ${userName}.`,
      farmerId: userId,
      farmerName: userName,
    };
    addProduct(product);
    setPublishedId(id);
  };

  if (publishedId) {
    return (
      <div className="mt-8 rounded-3xl border border-agro-200 bg-white p-10 text-center shadow-sm">
        <CheckCircle2 size={56} className="mx-auto text-agro-600" />
        <h2 className="mt-4 text-xl font-extrabold text-agro-800">
          ¡Tu cosecha fue publicada!
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-stone-500">
          Demo: la publicación se guarda en este navegador (localStorage) hasta
          que se conecte el backend.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={`/producto/${publishedId}`}
            className="rounded-xl bg-agro-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-agro-600"
          >
            Ver mi publicación
          </Link>
          <button
            onClick={() => {
              setPublishedId(null);
              setPreview(null);
              setForm({
                product: "",
                quantity: "",
                price: "",
                harvestDate: "",
                location: "",
                quality: "Premium",
              });
            }}
            className="rounded-xl border-2 border-agro-700 px-6 py-3 text-sm font-bold text-agro-700 transition hover:bg-agro-50"
          >
            Publicar otra
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 grid gap-5 rounded-3xl border border-cream-200 bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-8"
    >
      <div>
        <label className="mb-1.5 block text-sm font-semibold">Producto</label>
        <select
          value={form.product}
          onChange={(e) => update("product")(e.target.value)}
          className={inputCls}
        >
          <option value="" disabled>
            Ej: Palta Hass
          </option>
          {PRODUCT_OPTIONS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold">
          Cantidad disponible (kg)
        </label>
        <input
          type="number"
          min="1"
          placeholder="Ej: 500"
          value={form.quantity}
          onChange={(e) => update("quantity")(e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold">
          Precio sugerido (S/ por kg)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Ej: 4.50"
          value={form.price}
          onChange={(e) => update("price")(e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold">
          Fecha de cosecha
        </label>
        <input
          type="date"
          value={form.harvestDate}
          onChange={(e) => update("harvestDate")(e.target.value)}
          className={inputCls}
        />
      </div>

      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-semibold">Ubicación</label>
        <select
          value={form.location}
          onChange={(e) => update("location")(e.target.value)}
          className={inputCls}
        >
          <option value="" disabled>
            Ej: Ica, Pisco, Chincha
          </option>
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="sm:col-span-2">
        <legend className="mb-1.5 text-sm font-semibold">
          Calidad del producto
        </legend>
        <div className="grid grid-cols-3 gap-3">
          {QUALITIES.map(({ value, label, desc, Icon }) => (
            <label
              key={value}
              className={`cursor-pointer rounded-xl border-2 p-3 text-center transition ${
                form.quality === value
                  ? "border-sun-400 bg-sun-300/20"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <input
                type="radio"
                name="quality"
                value={value}
                checked={form.quality === value}
                onChange={() => update("quality")(value)}
                className="sr-only"
              />
              <Icon
                size={20}
                className={`mx-auto ${
                  form.quality === value ? "text-sun-600" : "text-stone-400"
                }`}
              />
              <p className="mt-1 text-sm font-bold">{label}</p>
              <p className="text-xs text-stone-500">{desc}</p>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-semibold">
          Fotografía del producto
        </label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-cream-50 px-4 py-8 text-sm text-stone-500 transition hover:border-agro-400 hover:bg-agro-50"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Vista previa"
              className="h-24 w-24 rounded-lg object-cover"
            />
          ) : (
            <Camera size={28} className="text-stone-400" />
          )}
          {preview ? "Cambiar fotografía" : "Agregar fotografía"}
          <span className="text-xs">Máx. 5 fotos (demo)</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onFile}
          className="hidden"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 sm:col-span-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-xl bg-sun-400 py-3.5 font-bold text-stone-900 shadow-sm transition hover:bg-sun-300 sm:col-span-2"
      >
        <CloudUpload size={20} /> Publicar
      </button>
      <p className="text-center text-xs text-stone-400 sm:col-span-2">
        Demo: la publicación se guarda en tu navegador.
      </p>
    </form>
  );
}
