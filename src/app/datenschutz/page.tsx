import type { Metadata } from "next";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung des E-Motion Rennteams Aalen: Informationen zur Verarbeitung personenbezogener Daten auf dieser Website.",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Rechtliches</p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">Datenschutzerklärung</h1>
      </Reveal>

      <Reveal delay={0.05} className="mt-12 max-w-2xl space-y-8 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-semibold text-foreground">1. Verantwortlicher</h2>
          <p className="mt-2">
            Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            <br />
            E-Motion Rennteam Aalen e.V., Beethovenstraße 1, 73430 Aalen
            <br />
            E-Mail:{" "}
            <a href="mailto:vorstand@emotion-rennteam.de" className="text-accent hover:underline">
              vorstand@emotion-rennteam.de
            </a>
            , Telefon: 07361 5762191
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">2. Erhebung und Speicherung personenbezogener Daten</h2>
          <p className="mt-2">
            Beim Aufruf dieser Website werden durch den auf deinem Endgerät zum Einsatz kommenden
            Browser automatisch Informationen an den Server unserer Website gesendet
            (Server-Logfiles), z. B. IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite
            sowie Browsertyp und -version. Diese Daten sind technisch erforderlich und werden nach
            spätestens sieben Tagen automatisch gelöscht.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">3. Kontakt-, Sponsoring- und Bewerbungsformular</h2>
          <p className="mt-2">
            Wenn du uns per Kontakt-, Sponsoring- oder Bewerbungsformular Anfragen zukommen lässt,
            werden deine Angaben aus dem jeweiligen Formular inklusive der von dir dort
            angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von
            Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne deine
            Einwilligung weiter. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO (Einwilligung),
            sofern du dieser im Formular zugestimmt hast. Die Daten werden gelöscht, sobald sie
            für die Erreichung des Zwecks ihrer Erhebung nicht mehr erforderlich sind, spätestens
            nach 24 Monaten.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">4. Newsletter</h2>
          <p className="mt-2">
            Wenn du dich für unseren Newsletter anmeldest, verwenden wir deine E-Mail-Adresse
            ausschließlich für den Versand des Newsletters. Eine Abmeldung ist jederzeit über den
            entsprechenden Link im Newsletter oder per E-Mail an uns möglich. Rechtsgrundlage ist
            Art. 6 Abs. 1 lit. a DSGVO.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">5. Deine Rechte</h2>
          <p className="mt-2">
            Du hast jederzeit das Recht auf Auskunft über deine bei uns gespeicherten
            personenbezogenen Daten, deren Herkunft und Empfänger sowie den Zweck der
            Datenverarbeitung. Ebenso steht dir ein Recht auf Berichtigung, Sperrung, Löschung
            oder Widerspruch gegen die Verarbeitung dieser Daten zu. Wende dich hierzu an die oben
            genannte Kontaktadresse. Dir steht zudem ein Beschwerderecht bei der zuständigen
            Aufsichtsbehörde zu.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">6. Hosting</h2>
          <p className="mt-2">
            Diese Website wird bei einem externen Dienstleister gehostet. Die personenbezogenen
            Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters
            gespeichert. Der Hoster wird die Daten nur insoweit verarbeiten, wie dies zur Erfüllung
            seiner Leistungspflichten erforderlich ist und unsere Weisungen bezüglich dieser Daten
            befolgen.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">7. Änderung dieser Datenschutzerklärung</h2>
          <p className="mt-2">
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den
            aktuellen rechtlichen Anforderungen entspricht. Für deinen erneuten Besuch gilt dann
            die neue Datenschutzerklärung.
          </p>
        </section>
      </Reveal>
    </div>
  );
}
