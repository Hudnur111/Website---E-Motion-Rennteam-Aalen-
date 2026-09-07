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
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Rechtliches</p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">Datenschutzerklärung</h1>
      </Reveal>

      <Reveal delay={0.05} className="mt-12 max-w-2xl space-y-8 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-semibold text-foreground">1. Verantwortlicher</h2>
          <p className="mt-2">
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) für die
            Datenverarbeitung auf dieser Website ist:
            <br />
            E-Motion Rennteam Aalen e.V.
            <br />
            vertreten durch Linda Mann, 1. Vorstand
            <br />
            Hochschule Aalen, Beethovenstraße 1, 73430 Aalen
            <br />
            E-Mail:{" "}
            <a href="mailto:info@emotion-rennteam.de" className="text-accent-text underline">
              info@emotion-rennteam.de
            </a>
            , Telefon: +49 7361 5762191
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">2. Allgemeines zur Datenverarbeitung</h2>
          <p className="mt-2">
            Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies
            zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen
            erforderlich ist. Die Verarbeitung erfolgt regelmäßig nur nach Einwilligung der
            Nutzer (Art. 6 Abs. 1 lit. a DSGVO) oder, soweit die Verarbeitung zur Erfüllung
            technischer Erfordernisse notwendig ist, auf Grundlage unseres berechtigten
            Interesses an einem sicheren und funktionsfähigen Betrieb dieser Website
            (Art. 6 Abs. 1 lit. f DSGVO).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">3. Server-Logfiles</h2>
          <p className="mt-2">
            Beim Aufruf dieser Website werden durch den auf deinem Endgerät zum Einsatz kommenden
            Browser automatisch Informationen an den Server unserer Website gesendet
            (Server-Logfiles), z. B. IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite
            sowie Browsertyp und -version. Diese Daten sind zur Auslieferung der Website und zur
            Abwehr von Missbrauch (z. B. übermäßig vielen Formularanfragen) technisch erforderlich
            (Art. 6 Abs. 1 lit. f DSGVO) und werden nach spätestens sieben Tagen automatisch
            gelöscht.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">4. Cookies</h2>
          <p className="mt-2">
            Diese Website verwendet ausschließlich ein technisch notwendiges Cookie
            (<code className="rounded bg-surface-2 px-1 py-0.5">cookie-consent</code>), das deine
            Auswahl im Cookie-Hinweis für 180 Tage in deinem Browser speichert, damit dir der
            Hinweis nicht bei jedem Besuch erneut angezeigt wird. Da dieses Cookie zur
            Bereitstellung dieser Funktion zwingend erforderlich ist, ist hierfür keine
            Einwilligung nach § 25 Abs. 2 Nr. 2 TTDSG erforderlich (Art. 6 Abs. 1 lit. f DSGVO).
            Analyse-, Marketing- oder Tracking-Cookies sowie entsprechende Dienste Dritter setzen
            wir nicht ein.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">
            5. Kontakt-, Bewerbungs-, Sponsoring- und Mediakit-Formular
          </h2>
          <p className="mt-2">
            Wenn du uns per Kontakt-, Bewerbungs-, Sponsoring- oder Mediakit-Formular Anfragen
            zukommen lässt, werden deine Angaben aus dem jeweiligen Formular inklusive der von dir
            dort angegebenen Kontaktdaten zur Bearbeitung deiner Anfrage und für den Fall von
            Anschlussfragen bei uns gespeichert. Rechtsgrundlage ist deine im Formular erteilte
            Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Zur Erkennung automatisierter Spam-Einträge
            setzen wir ein unsichtbares Formularfeld sowie eine Plausibilitätsprüfung der
            Ausfüllzeit ein; hierbei werden keine zusätzlichen personenbezogenen Daten erhoben.
            Deine Angaben leiten wir intern an die für die Bearbeitung zuständigen Teammitglieder
            weiter, geben sie aber nicht ohne deine Einwilligung an außenstehende Dritte weiter.
            Die Daten werden gelöscht, sobald sie für die Erreichung des Zwecks ihrer Erhebung
            nicht mehr erforderlich sind, spätestens nach 24 Monaten.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">6. Schriftarten (Google Fonts)</h2>
          <p className="mt-2">
            Diese Website nutzt zur einheitlichen Darstellung von Schriftarten den Dienst „Google
            Fonts“. Die verwendeten Schriftdateien werden dabei bereits beim Bauen der Website
            heruntergeladen und lokal auf unserem eigenen Server ausgeliefert. Bei deinem Besuch
            dieser Website findet daher keine Verbindung zu Servern von Google statt und es werden
            keine Daten an Google übertragen.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">7. Kartendienst auf der Kontaktseite</h2>
          <p className="mt-2">
            Auf unserer Kontaktseite binden wir eine interaktive Karte ein, um unseren Standort
            anzuzeigen. Dabei wird die Kartenbibliothek „Leaflet“ über das Content Delivery
            Network „cdnjs“ (Betreiber: Cloudflare, Inc.) geladen, und die Kartenkacheln werden
            vom Anbieter CARTO bezogen (Kartendaten © OpenStreetMap-Mitwirkende). Beim Laden der
            Kontaktseite wird deine IP-Adresse an diese Anbieter übertragen, damit die Karte
            angezeigt werden kann. Dies erfolgt auf Grundlage unseres berechtigten Interesses an
            einer nutzerfreundlichen Standortanzeige (Art. 6 Abs. 1 lit. f DSGVO). Weitere
            Informationen findest du in den Datenschutzhinweisen von{" "}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-text underline"
            >
              Cloudflare
            </a>{" "}
            und{" "}
            <a
              href="https://carto.com/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-text underline"
            >
              CARTO
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">8. Verlinkte Social-Media-Profile</h2>
          <p className="mt-2">
            Wir verlinken auf dieser Website auf unsere Profile bei Instagram und LinkedIn. Diese
            Links führen dich auf die jeweilige externe Plattform; erst dort, nicht bereits beim
            Anklicken des Links auf unserer Website, werden Daten an den jeweiligen Anbieter
            übertragen. Es gelten die Datenschutzbestimmungen des jeweiligen Anbieters (Meta
            Platforms Ireland Limited für Instagram, LinkedIn Ireland Unlimited Company für
            LinkedIn).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">9. SSL-/TLS-Verschlüsselung</h2>
          <p className="mt-2">
            Diese Website nutzt aus Sicherheitsgründen eine SSL-/TLS-Verschlüsselung zur
            Übertragung vertraulicher Inhalte, wie zum Beispiel Anfragen, die du über unsere
            Formulare an uns sendest. Eine verschlüsselte Verbindung erkennst du daran, dass die
            Adresszeile deines Browsers von „http://“ auf „https://“ wechselt und an dem
            Schloss-Symbol in deiner Browserzeile.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">10. Hosting</h2>
          <p className="mt-2">
            Diese Website wird bei einem externen Dienstleister gehostet. Die personenbezogenen
            Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters
            gespeichert. Der Hoster wird die Daten nur insoweit verarbeiten, wie dies zur Erfüllung
            seiner Leistungspflichten erforderlich ist, und unsere Weisungen bezüglich dieser
            Daten befolgen. Mit unserem Hoster besteht, soweit erforderlich, ein Vertrag zur
            Auftragsverarbeitung gemäß Art. 28 DSGVO.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">11. Deine Rechte</h2>
          <p className="mt-2">
            Du hast jederzeit das Recht auf Auskunft über deine bei uns gespeicherten
            personenbezogenen Daten, deren Herkunft und Empfänger sowie den Zweck der
            Datenverarbeitung (Art. 15 DSGVO). Ebenso steht dir ein Recht auf Berichtigung
            (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18
            DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) sowie ein Widerspruchsrecht gegen die
            Verarbeitung deiner Daten (Art. 21 DSGVO) zu. Hast du uns eine Einwilligung erteilt,
            kannst du diese jederzeit mit Wirkung für die Zukunft widerrufen, ohne dass die
            Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung berührt wird. Wende dich
            hierzu an die oben genannte Kontaktadresse.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">12. Beschwerderecht bei der Aufsichtsbehörde</h2>
          <p className="mt-2">
            Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs
            steht dir ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu, insbesondere
            in dem Mitgliedstaat deines gewöhnlichen Aufenthaltsorts. Für uns zuständig ist:
            <br />
            Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit
            Baden-Württemberg (LfDI)
            <br />
            Königstraße 10a, 70173 Stuttgart
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">13. Änderung dieser Datenschutzerklärung</h2>
          <p className="mt-2">
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den
            aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in
            der Datenschutzerklärung umzusetzen. Für deinen erneuten Besuch gilt dann die neue
            Datenschutzerklärung.
          </p>
        </section>
      </Reveal>
    </div>
  );
}
