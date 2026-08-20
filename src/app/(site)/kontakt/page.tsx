import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktiere das E-Motion Rennteam Aalen: Fragen, Kooperationen oder Sponsoring-Anfragen an die Hochschule Aalen.",
  alternates: { canonical: "/kontakt" },
};

export default function ContactPage() {
  const page = getPage("contact");

  const address = page?.address ?? "E-Motion Rennteam Aalen\nHochschule Aalen\nBeethovenstraße 1\n73430 Aalen";
  const email = page?.email ?? "vorstand@emotion-rennteam.de";
  const phone = page?.phone ?? "07361 5762191";
  const socialMedia = page?.socialMedia ?? "Instagram · LinkedIn · YouTube";

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Kontakt</p>
        <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">
          {page?.heroTitle ?? "Kontaktiere uns"}
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          {page?.heroSubtitle ??
            "Ob Sponsoring, Presse oder Bewerbung – wir freuen uns auf deine Nachricht."}
        </p>
      </Reveal>

      <div className="mt-14 grid gap-12 md:grid-cols-2">
        <Reveal direction="left">
          <ContactForm />
        </Reveal>

        <Reveal direction="right" delay={0.1} className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/40">
            <h2 className="font-semibold">Adresse</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-muted">{address}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/40">
            <h2 className="font-semibold">E-Mail</h2>
            <p className="mt-2 text-sm text-muted">
              <a href={`mailto:${email}`} className="text-accent-text underline">
                {email}
              </a>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/40">
            <h2 className="font-semibold">Telefon</h2>
            <p className="mt-2 text-sm text-muted">
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-accent-text underline">
                {phone}
              </a>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/40">
            <h2 className="font-semibold">Social Media</h2>
            <p className="mt-2 text-sm text-muted">{socialMedia}</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
