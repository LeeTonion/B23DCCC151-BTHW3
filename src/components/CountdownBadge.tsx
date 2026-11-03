"use client";

import { useEffect, useState } from "react";

interface CountdownBadgeProps {
  dueDate: string;
  className?: string;
}

export default function CountdownBadge({ dueDate, className = "" }: CountdownBadgeProps) {
  const [text, setText] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      const due = new Date(dueDate);
      const diffMs = due.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        const overDays = Math.abs(diffDays);
        setText(`Quá hạn ${overDays} ngày`);
        setColor("bg-red-500/20 text-red-400 border-red-500/30");
      } else if (diffDays === 0) {
        setText("Hôm nay!");
        setColor("bg-orange-500/20 text-orange-400 border-orange-500/30");
      } else if (diffDays <= 3) {
        setText(`Còn ${diffDays} ngày`);
        setColor("bg-yellow-500/20 text-yellow-400 border-yellow-500/30");
      } else if (diffDays <= 7) {
        setText(`Còn ${diffDays} ngày`);
        setColor("bg-blue-500/20 text-blue-400 border-blue-500/30");
      } else {
        setText(`Còn ${diffDays} ngày`);
        setColor("bg-emerald-500/20 text-emerald-400 border-emerald-500/30");
      }
    }

    update();
    const interval = setInterval(update, 60000); // update every minute
    return () => clearInterval(interval);
  }, [dueDate]);

  if (!text) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${color} ${className}`}
    >
      ⏱ {text}
    </span>
  );
}

