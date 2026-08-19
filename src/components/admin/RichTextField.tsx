"use client";

import { useRef } from "react";

interface Props {
  id: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}

// Wraps (or inserts, if nothing is selected) the current textarea selection
// in markdown syntax, then restores focus and selection so formatting
// several ranges in a row doesn't require re-clicking into the field.
function applyMarkdown(
  textarea: HTMLTextAreaElement,
  onChange: (v: string) => void,
  wrap: { before: string; after?: string; placeholder: string }
) {
  const { before, after = before, placeholder } = wrap;
  const { selectionStart, selectionEnd, value } = textarea;
  const selected = value.slice(selectionStart, selectionEnd) || placeholder;
  const next = value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd);
  onChange(next);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(selectionStart + before.length, selectionStart + before.length + selected.length);
  });
}

function applyLinePrefix(textarea: HTMLTextAreaElement, onChange: (v: string) => void, prefix: string) {
  const { selectionStart, selectionEnd, value } = textarea;
  const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
  const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
  onChange(next);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(selectionStart + prefix.length, selectionEnd + prefix.length);
  });
}

export default function RichTextField({ id, value, onChange, rows = 8 }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function withTextarea(fn: (el: HTMLTextAreaElement) => void) {
    if (textareaRef.current) fn(textareaRef.current);
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1 rounded-lg border border-border bg-surface-2 p-1">
        <button
          type="button"
          onClick={() => withTextarea((el) => applyMarkdown(el, onChange, { before: "**", placeholder: "fett" }))}
          className="rounded-md px-2.5 py-1 text-xs font-bold text-foreground transition-colors hover:bg-surface"
        >
          Fett
        </button>
        <button
          type="button"
          onClick={() => withTextarea((el) => applyMarkdown(el, onChange, { before: "_", placeholder: "kursiv" }))}
          className="rounded-md px-2.5 py-1 text-xs italic text-foreground transition-colors hover:bg-surface"
        >
          Kursiv
        </button>
        <button
          type="button"
          onClick={() =>
            withTextarea((el) => applyMarkdown(el, onChange, { before: "[", after: "](https://)", placeholder: "Linktext" }))
          }
          className="rounded-md px-2.5 py-1 text-xs text-foreground underline transition-colors hover:bg-surface"
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => withTextarea((el) => applyLinePrefix(el, onChange, "- "))}
          className="rounded-md px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-surface"
        >
          Liste
        </button>
      </div>
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent"
        placeholder="Markdown-Text…"
      />
    </div>
  );
}
