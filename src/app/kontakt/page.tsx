import { getPage } from "@/lib/content";
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Kontakt | E-Motion Rennteam Aalen" };

export default function ContactPage() {
  const page = getPage("contact");

  return (
    <div className="container-page py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">Kontakt</p>
      <h1 className="mt-2 text-4xl font-extrabold">
        {page?.heroTitle ?? "Kontaktiere uns"}
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        {page?.heroSubtitle ??
          "Ob Sponsoring, Presse oder Bewerbung – wir freuen uns auf deine Nachricht."}
      </p>

      <div className="mt-14 grid gap-12 md:grid-cols-2">
        <ContactForm />

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6">
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
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-semibold">E-Mail</h2>
            <p className="mt-2 text-sm text-muted">
              <a href="mailto:info@e-motion-aalen.de" className="text-accent hover:underline">
                info@e-motion-aalen.de
              </a>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-semibold">Social Media</h2>
            <p className="mt-2 text-sm text-muted">Instagram · LinkedIn · YouTube</p>
          </div>
        </div>
      </div>
    </div>
  );
}
