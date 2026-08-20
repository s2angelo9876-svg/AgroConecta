"use client";

import { useEffect, useState } from "react";
import {
  X,
  CreditCard,
  Smartphone,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import type { Product } from "@/data/mock";
import FakeQR from "./FakeQR";

type Method = "tarjeta" | "yape" | "plin";
type Step = "form" | "procesando" | "exito";

const METHODS: { id: Method; label: string; desc: string; color: string }[] = [
  {
    id: "tarjeta",
    label: "Tarjeta",
    desc: "Visa · Mastercard · BCP, Interbank, BBVA y más",
    color: "border-agro-600 bg-agro-50",
  },
  {
    id: "yape",
    label: "Yape",
    desc: "Paga escaneando el QR con tu app",
    color: "border-purple-600 bg-purple-50",
  },
  {
    id: "plin",
    label: "Plin",
    desc: "Paga escaneando el QR con tu app",
    color: "border-cyan-500 bg-cyan-50",
  },
];

const inputCls =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-agro-500 focus:ring-2 focus:ring-agro-100";

export default function CheckoutModal({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product: Product;
}) {
  const [method, setMethod] = useState<Method>("yape");
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<Step>("form");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  useEffect(() => {
    if (open) {
      setStep("form");
      setQuantity(1);
      setMethod("yape");
    }
  }, [open]);

  if (!open) return null;

  const total = product.price * quantity;

  const pay = () => {
    setStep("procesando");
    setTimeout(() => setStep("exito"), 1500);
  };

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={step === "procesando" ? undefined : onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {step === "exito" ? (
          <div className="py-6 text-center">
            <CheckCircle2 size={64} className="mx-auto text-agro-600" />
            <h3 className="mt-4 text-xl font-extrabold text-agro-800">
              ¡Pago realizado con éxito!
            </h3>
            <p className="mt-2 text-sm text-stone-500">
              Orden #{Date.now().toString().slice(-6)} · S/ {total.toFixed(2)} ·{" "}
              {quantity} kg de {product.name}
            </p>
            <p className="mt-4 rounded-lg bg-cream-100 p-3 text-xs text-stone-500">
              Demo: no se realizó ningún cargo real. En producción aquí se
              confirmaría el pago vía webhook de la pasarela.
            </p>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-xl bg-agro-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-agro-600"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-agro-800">
                  Finalizar compra
                </h3>
                <p className="text-sm text-stone-500">
                  {product.name} · S/ {product.price.toFixed(2)} /{" "}
                  {product.unit}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="rounded-full p-1 text-stone-400 transition hover:bg-cream-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cantidad */}
            <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-cream-200 bg-cream-50 px-4 py-3">
              <label className="text-sm font-semibold">Cantidad (kg)</label>
              <input
                type="number"
                min={1}
                max={product.quantity}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(
                      1,
                      Math.min(product.quantity, Number(e.target.value) || 1)
                    )
                  )
                }
                className="w-24 rounded-lg border border-stone-200 px-3 py-1.5 text-right text-sm font-bold outline-none focus:border-agro-500"
              />
            </div>

            {/* Métodos de pago */}
            <p className="mt-5 text-sm font-bold text-stone-700">
              Método de pago
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`rounded-xl border-2 p-3 text-center transition ${
                    method === m.id
                      ? m.color
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {m.id === "tarjeta" ? (
                    <CreditCard size={22} className="mx-auto text-agro-700" />
                  ) : (
                    <Smartphone
                      size={22}
                      className={`mx-auto ${
                        m.id === "yape" ? "text-purple-700" : "text-cyan-600"
                      }`}
                    />
                  )}
                  <p className="mt-1 text-sm font-bold">{m.label}</p>
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-stone-400">
              {METHODS.find((m) => m.id === method)?.desc}
            </p>

            {/* Formulario tarjeta */}
            {method === "tarjeta" && (
              <div className="mt-4 space-y-3 rounded-xl border border-cream-200 bg-cream-50 p-4">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Número de tarjeta"
                  value={card.number}
                  onChange={(e) =>
                    setCard({ ...card, number: formatCardNumber(e.target.value) })
                  }
                  className={inputCls}
                />
                <input
                  type="text"
                  placeholder="Nombre del titular"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  className={inputCls}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/AA"
                    value={card.expiry}
                    onChange={(e) =>
                      setCard({ ...card, expiry: formatExpiry(e.target.value) })
                    }
                    className={inputCls}
                  />
                  <input
                    type="password"
                    inputMode="numeric"
                    placeholder="CVV"
                    maxLength={4}
                    value={card.cvv}
                    onChange={(e) =>
                      setCard({
                        ...card,
                        cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                      })
                    }
                    className={inputCls}
                  />
                </div>
              </div>
            )}

            {/* QR Yape / Plin */}
            {(method === "yape" || method === "plin") && (
              <div className="mt-4 rounded-xl border border-cream-200 bg-cream-50 p-4 text-center">
                <FakeQR seed={`${method}-${product.id}-${total}`} />
                <p className="mt-3 text-sm font-bold capitalize">
                  Escanea con {method === "yape" ? "Yape" : "Plin"}
                </p>
                <p className="text-xs text-stone-500">
                  o al número{" "}
                  <span className="font-bold text-stone-700">987 654 321</span>{" "}
                  · AgroConecta
                </p>
              </div>
            )}

            <button
              onClick={pay}
              disabled={step === "procesando"}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-sun-400 px-4 py-3.5 font-bold text-stone-900 shadow-sm transition hover:bg-sun-300 disabled:opacity-70"
            >
              {step === "procesando" ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Procesando
                  pago...
                </>
              ) : (
                <>Pagar S/ {total.toFixed(2)}</>
              )}
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-stone-400">
              <ShieldCheck size={14} /> Demo: no se realizará ningún cargo real.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
