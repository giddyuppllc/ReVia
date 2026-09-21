import { FlaskConical } from "lucide-react";

export default function RuoBanner() {
  return (
    <div className="bg-stone-800 text-center py-2 px-4">
      <p className="text-[0.6875rem] sm:text-xs text-stone-300 flex items-center justify-center gap-1.5">
        <FlaskConical className="h-3 w-3 text-sky-400 shrink-0" />
        <span>Everything listed here is <strong className="text-white">Research Use Only (RUO)</strong>. Not for human or animal consumption.</span>
      </p>
    </div>
  );
}
