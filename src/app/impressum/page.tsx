import Reveal from "@/components/motion/Reveal";

export const metadata = { title: "Impressum | E-Motion Rennteam Aalen" };

export default function ImpressumPage() {
  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Rechtliches</p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">Impressum</h1>
      </Reveal>

      <Reveal delay={0.05} className="mt-12 max-w-2xl space-y-8 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-semibold text-foreground">Angaben gemäß § 5 TMG</h2>
          <p className="mt-2">
            E-Motion Rennteam Aalen e.V.
            <br />
            Hochschule Aalen
            <br />
            Beethovenstraße 1
            <br />
            73430 Aalen
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Vertreten durch</h2>
          <p className="mt-2">[Name des/der Vorstandsvorsitzenden einfügen]</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Website</h2>
          <p className="mt-2">
            Programmierung und Leitung: Denny Svalina, Abteilung Powertrain
            <br />
            E-Mail:{" "}
            <a
              href="mailto:denny.svalia@emotion-rennteam.de"
              className="text-accent hover:underline"
            >
              denny.svalia@emotion-rennteam.de
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Kontakt</h2>
          <p className="mt-2">
            Telefon: 07361 5762191
            <br />
            E-Mail:{" "}
            <a href="mailto:vorstand@emotion-rennteam.de" className="text-accent hover:underline">
              vorstand@emotion-rennteam.de
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Registereintrag</h2>
          <p className="mt-2">
            Eintragung im Vereinsregister.
            <br />
            Registergericht: [Registergericht einfügen]
            <br />
            Registernummer: [Registernummer einfügen]
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p className="mt-2">
            [Name, Anschrift wie oben]
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">EU-Streitschlichtung</h2>
          <p className="mt-2">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
            bereit, die unter{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              ec.europa.eu/consumers/odr
            </a>{" "}
            erreichbar ist. Unsere E-Mail-Adresse finden Sie oben. Wir sind nicht bereit oder
            verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Haftung für Inhalte</h2>
          <p className="mt-2">
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Haftung für Links</h2>
          <p className="mt-2">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
            übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
            Betreiber der Seiten verantwortlich.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Urheberrecht</h2>
          <p className="mt-2">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
            unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.
          </p>
        </section>
      </Reveal>
    </div>
  );
}
