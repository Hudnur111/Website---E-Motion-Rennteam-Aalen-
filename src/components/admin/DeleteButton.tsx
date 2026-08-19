"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ collection, slug, label }: { collection: string; slug: string; label: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`"${label}" wirklich löschen? Das kann nicht rückgängig gemacht werden.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content/${collection}/${slug}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Löschen fehlgeschlagen.");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-md px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-60"
    >
      {loading ? "…" : "Löschen"}
    </button>
  );
}
