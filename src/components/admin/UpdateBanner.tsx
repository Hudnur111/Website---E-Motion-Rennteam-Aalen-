"use client";

import { useEffect, useRef, useState } from "react";

type UpdateStatus = "unknown" | "checking" | "up-to-date" | "installing-dependencies" | "restarting" | "updated";

interface StatusResponse {
  status: UpdateStatus;
  appliedAt?: string;
}

const NORMAL_POLL_MS = 20_000;
const FAST_POLL_MS = 2_000;
const SEEN_UPDATE_KEY = "cms-last-seen-update";

// Zeigt der Redaktion einen Hinweis, waehrend scripts/cms-supervisor.mjs im
// Hintergrund ein gefundenes Update einspielt und den Server neu startet.
// Ohne laufenden Supervisor (Status "unknown") wird nichts angezeigt.
export default function UpdateBanner() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const wasBusyRef = useRef(false);

  // Der Supervisor prueft absichtlich nicht schon beim Server-Start auf
  // Updates - das wuerde den Start verzoegern, bevor ueberhaupt jemand da
  // ist. Stattdessen stoesst genau dieser Aufruf hier den ersten (und
  // danach periodischen) Hintergrund-Check erst an, sobald tatsaechlich
  // jemand eingeloggt im Panel ankommt.
  useEffect(() => {
    fetch("/api/admin/trigger-update-check", { method: "POST" }).catch(() => {
      // Kein laufender Supervisor oder Netzwerkproblem - dann bleibt es
      // einfach beim manuellen/spaeteren Start, kein Fehlerfall.
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch("/api/admin/update-status", { cache: "no-store" });
        if (res.ok) {
          const data: StatusResponse = await res.json();
          if (cancelled) return;

          const busy = data.status === "installing-dependencies" || data.status === "restarting";
          // Der Server kommt gerade wieder online, nachdem er fuer den
          // Neustart kurz nicht erreichbar war - jetzt die Seite neu laden,
          // damit der neue Code tatsaechlich zum Einsatz kommt.
          if (wasBusyRef.current && !busy) {
            window.location.reload();
            return;
          }
          wasBusyRef.current = busy;
          setStatus(data);
        }
      } catch {
        // Server waehrend eines Neustarts kurz nicht erreichbar - das ist
        // erwartet, einfach beim naechsten Poll weiter versuchen.
      } finally {
        if (!cancelled) {
          const nextDelay = wasBusyRef.current ? FAST_POLL_MS : NORMAL_POLL_MS;
          timer = setTimeout(poll, nextDelay);
        }
      }
    }

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  if (!status) return null;

  if (status.status === "installing-dependencies" || status.status === "restarting") {
    return (
      <div className="border-b border-accent/30 bg-accent/10 px-4 py-2.5 text-center text-sm text-accent-text sm:px-6">
        Ein Update wird automatisch eingespielt - die Seite laedt gleich neu…
      </div>
    );
  }

  if (status.status === "updated" && status.appliedAt) {
    const alreadySeen = typeof window !== "undefined" && localStorage.getItem(SEEN_UPDATE_KEY) === status.appliedAt;
    if (alreadySeen) return null;
    try {
      localStorage.setItem(SEEN_UPDATE_KEY, status.appliedAt);
    } catch {
      // localStorage ggf. nicht verfuegbar - Hinweis wird dann bei jedem
      // Laden kurz erneut angezeigt, kein Problem.
    }
    return (
      <div className="border-b border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-center text-sm text-emerald-400 sm:px-6">
        Update wurde automatisch eingespielt - du nutzt jetzt die neueste Version.
      </div>
    );
  }

  return null;
}
