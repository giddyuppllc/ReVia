import { Truck } from "lucide-react";

export default function ShippingBanner() {
  return (
    <div className="w-full border-b border-emerald-200/40 bg-emerald-100/50 py-2">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 text-xs font-medium text-emerald-700 sm:text-sm">
        <Truck className="h-3.5 w-3.5" />
        <span>Free shipping on orders over $200</span>
      </div>
    </div>
  );
}
