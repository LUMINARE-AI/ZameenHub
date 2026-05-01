import { useState } from "react";

export default function FAQAccordion({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={item.question} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
            className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left text-slate-900 transition hover:bg-slate-50"
          >
            <span className="text-sm font-semibold">{item.question}</span>
            <span className="text-xl text-blue-600">{activeIndex === index ? "-" : "+"}</span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${activeIndex === index ? "max-h-40 px-3 pb-3" : "max-h-0 px-3"}`}
          >
            <p className="text-xs leading-5 text-slate-600">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
