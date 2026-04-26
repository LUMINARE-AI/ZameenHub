import { useState } from "react";

export default function FAQAccordion({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.question} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_45px_-24px_rgba(15,23,42,0.18)]">
          <button
            type="button"
            onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-slate-900 transition hover:bg-slate-50"
          >
            <span className="text-base font-semibold">{item.question}</span>
            <span className="text-2xl text-blue-600">{activeIndex === index ? "−" : "+"}</span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${activeIndex === index ? "max-h-40 px-6 pb-5" : "max-h-0 px-6"}`}
          >
            <p className="text-sm leading-7 text-slate-600">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
