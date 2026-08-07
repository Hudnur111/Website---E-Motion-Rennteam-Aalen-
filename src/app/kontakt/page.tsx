import { getPage } from "@/lib/content";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/motion/Reveal";

export const metadata = { title: "Kontakt | E-Motion Rennteam Aalen" };

export default function ContactPage() {
  const page = getPage("contact");

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Kontakt</p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">
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
            <p className="mt-2 text-sm text-muted">
              E-Motion Rennteam Aalen
              <br />
              Hochschule Aalen
              <br />
              Beethovenstraße 1
              <br />
              73430 Aalen
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/40">
            <h2 className="font-semibold">E-Mail</h2>
            <p className="mt-2 text-sm text-muted">
              <a href="mailto:vorstand@emotion-rennteam.de" className="text-accent hover:underline">
                vorstand@emotion-rennteam.de
              </a>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/40">
            <h2 className="font-semibold">Telefon</h2>
            <p className="mt-2 text-sm text-muted">
              <a href="tel:+4973615762191" className="text-accent hover:underline">
                07361 5762191
              </a>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/40">
            <h2 className="font-semibold">Social Media</h2>
            <p className="mt-2 text-sm text-muted">Instagram · LinkedIn · YouTube</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
