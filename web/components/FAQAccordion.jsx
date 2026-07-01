"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQAccordion({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const isOpen = activeIndex === index;

        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-brand/20"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-brand-ink transition hover:bg-brand-light/40"
            >
              <span className="text-sm font-semibold">{item.question}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-brand transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                strokeWidth={2.5}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-4 text-sm leading-6 text-brand-muted">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
