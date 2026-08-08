// Beschreibt alle bearbeitbaren Inhalts-Collections der Website.
// Diese Struktur spiegelt bewusst tina/config.ts, damit CMS und Website
// immer dieselben Felder kennen. Wird hier eine Collection ergänzt,
// muss auch tina/config.ts (und ggf. src/lib/content.ts) angepasst werden.

const COLLECTIONS = [
  {
    name: "team",
    label: "Team-Mitglieder",
    path: "content/team",
    fields: [
      { name: "name", label: "Name", type: "string", isTitle: true, required: true },
      { name: "role", label: "Position/Rolle", type: "string", required: true },
      {
        name: "department",
        label: "Abteilung",
        type: "select",
        options: [
          "Fahrzeugtechnik",
          "Elektrotechnik / High-Voltage",
          "Aerodynamik",
          "Fahrwerk",
          "Software / Autonomous",
          "Marketing & Finanzen",
          "Teamleitung",
        ],
      },
      { name: "photo", label: "Foto", type: "image" },
      { name: "linkedin", label: "LinkedIn-URL", type: "string" },
      { name: "order", label: "Reihenfolge", type: "number" },
      { name: "body", label: "Kurzbeschreibung", type: "markdown", isBody: true },
    ],
  },
  {
    name: "vehicle",
    label: "Fahrzeuge",
    path: "content/vehicles",
    fields: [
      { name: "name", label: "Fahrzeugname", type: "string", isTitle: true, required: true },
      { name: "year", label: "Baujahr", type: "number", required: true },
      { name: "tagline", label: "Kurzslogan", type: "string" },
      { name: "coverImage", label: "Titelbild", type: "image" },
      {
        name: "specs",
        label: "Technische Daten",
        type: "list",
        fields: [
          { name: "label", label: "Bezeichnung", type: "string" },
          { name: "value", label: "Wert", type: "string" },
        ],
      },
      { name: "current", label: "Aktuelles Fahrzeug", type: "boolean" },
      { name: "body", label: "Beschreibung", type: "markdown", isBody: true },
    ],
  },
  {
    name: "sponsor",
    label: "Sponsoren",
    path: "content/sponsors",
    fields: [
      { name: "name", label: "Name", type: "string", isTitle: true, required: true },
      {
        name: "tier",
        label: "Sponsoring-Stufe",
        type: "select",
        options: ["Platin", "Gold", "Silber", "Partner"],
        required: true,
      },
      { name: "logo", label: "Logo", type: "image" },
      { name: "website", label: "Website-URL", type: "string" },
      { name: "body", label: "Beschreibung", type: "markdown", isBody: true },
    ],
  },
  {
    name: "news",
    label: "News",
    path: "content/news",
    fields: [
      { name: "title", label: "Titel", type: "string", isTitle: true, required: true },
      { name: "date", label: "Datum", type: "datetime", required: true },
      { name: "excerpt", label: "Kurzbeschreibung", type: "string" },
      { name: "coverImage", label: "Titelbild", type: "image" },
      { name: "body", label: "Inhalt", type: "markdown", isBody: true },
    ],
  },
  {
    name: "blog",
    label: "Blog",
    path: "content/blog",
    fields: [
      { name: "title", label: "Titel", type: "string", isTitle: true, required: true },
      { name: "date", label: "Datum", type: "datetime", required: true },
      { name: "author", label: "Autor:in", type: "string" },
      { name: "excerpt", label: "Kurzbeschreibung", type: "string" },
      { name: "coverImage", label: "Titelbild", type: "image" },
      { name: "body", label: "Inhalt", type: "markdown", isBody: true },
    ],
  },
  {
    name: "galleryImage",
    label: "Galerie",
    path: "content/gallery",
    fields: [
      { name: "title", label: "Titel", type: "string", isTitle: true, required: true },
      { name: "image", label: "Bild", type: "image", required: true },
      { name: "order", label: "Reihenfolge", type: "number" },
    ],
  },
  {
    name: "result",
    label: "Erfolge",
    path: "content/results",
    fields: [
      { name: "title", label: "Titel", type: "string", isTitle: true, required: true },
      { name: "year", label: "Jahr", type: "number", required: true },
      { name: "event", label: "Wettbewerb", type: "string", required: true },
      { name: "placement", label: "Platzierung", type: "string" },
      { name: "description", label: "Beschreibung", type: "markdown", isBody: true },
    ],
  },
  {
    name: "position",
    label: "Offene Positionen",
    path: "content/positions",
    fields: [
      { name: "title", label: "Titel", type: "string", isTitle: true, required: true },
      { name: "department", label: "Abteilung", type: "string" },
      { name: "commitment", label: "Umfang", type: "string" },
      { name: "description", label: "Beschreibung", type: "markdown", isBody: true },
    ],
  },
  {
    name: "page",
    label: "Seiteninhalte",
    path: "content/pages",
    fields: [
      { name: "title", label: "Titel", type: "string", isTitle: true, required: true },
      { name: "heroTitle", label: "Hero-Titel", type: "string" },
      { name: "heroSubtitle", label: "Hero-Untertitel", type: "string" },
      { name: "body", label: "Inhalt", type: "markdown", isBody: true },
    ],
  },
];

function getCollection(name) {
  const collection = COLLECTIONS.find((c) => c.name === name);
  if (!collection) throw new Error(`Unbekannte Collection: ${name}`);
  return collection;
}

module.exports = { COLLECTIONS, getCollection };
