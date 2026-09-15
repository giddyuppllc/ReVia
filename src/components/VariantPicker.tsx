"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import PartnerShopButton from "@/components/PartnerShopButton";
import { D2C } from "@/lib/partner";

/* ------------------------------------------------------------------ */
/*  Variant picker                                                     */
/*                                                                     */
/*  Replaces the old AddToCart. It keeps everything that described the */
/*  product — variant selection, price, pre-order and stock state, and */
/*  the callback that swaps the product image — and ends in an         */
/*  outbound control instead of a cart, because this site no longer    */
/*  takes orders.                                                      */
/* ------------------------------------------------------------------ */

interface VariantPickerProps {
  variants: { id: string; label: string; price: number; inStock: boolean; stockStatus?: string }[];
  productName: string;
  onVariantChange?: (variantId: string) => void;
}

export default function VariantPicker({ variants, productName, onVariantChange }: VariantPickerProps) {
  const [selectedId, setSelectedId] = useState(
    () => (variants.find((v) => v.stockStatus !== "out_of_stock") ?? variants[0])?.id ?? ""
  );

  const selected = variants.find((v) => v.id === selectedId);
  const status = selected?.stockStatus ?? (selected?.inStock ? "in_stock" : "out_of_stock");
  const isPreOrder = status === "pre_order";
  const isOutOfStock = status === "out_of_stock";

  return (
    <div className="space-y-6">
      {/* Variant selector */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-neutral-500">Select Variant</h3>
        <div className="flex flex-wrap gap-3">
          {variants.map((v) => {
            const isSelected = v.id === selectedId;
            const vStatus = v.stockStatus ?? (v.inStock ? "in_stock" : "out_of_stock");
            const vIsOut = vStatus === "out_of_stock";
            const vIsPreOrder = vStatus === "pre_order";
            return (
              <button
                key={v.id}
                onClick={() => { setSelectedId(v.id); onVariantChange?.(v.id); }}
                disabled={vIsOut}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  vIsOut
                    ? "cursor-not-allowed border-neutral-100 bg-neutral-50 text-neutral-300"
                    : isSelected
                    ? vIsPreOrder
                      ? "border-amber-500 bg-amber-50 text-stone-600"
                      : "border-sky-600 bg-sky-50 text-stone-600"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                <span className={`block ${vIsOut ? "line-through" : ""}`}>{v.label}</span>
                <span className="mt-1 block text-xs">
                  {vIsOut ? (
                    <span className="text-red-400">Out of Stock</span>
                  ) : vIsPreOrder ? (
                    <span className="text-amber-600">Pre-Order · ${(v.price / 100).toFixed(2)}</span>
                  ) : (
                    `$${(v.price / 100).toFixed(2)}`
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price display */}
      {selected && !isOutOfStock && (
        <div>
          <p className="text-2xl font-bold text-neutral-900">
            ${(selected.price / 100).toFixed(2)}
          </p>
          {isPreOrder && (
            <div className="flex items-center gap-2 mt-2 text-amber-600">
              <Clock className="h-4 w-4" />
              <p className="text-sm font-medium">
                Pre-Order — estimated to ship within 5–7 business days
              </p>
            </div>
          )}
        </div>
      )}

      {/* Outbound purchase path */}
      <div className="rounded-2xl border border-sky-200/60 bg-sky-50/60 p-4">
        <p className="text-sm text-stone-600">
          {productName} is supplied by our exclusive research partner, {D2C.name}.
        </p>
        <PartnerShopButton audience="d2c" size="md" variant="solid" className="mt-3 w-full justify-center">
          Shop at {D2C.name}
        </PartnerShopButton>
      </div>
    </div>
  );
}
