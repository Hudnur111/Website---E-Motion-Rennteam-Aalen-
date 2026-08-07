import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || undefined,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      {
        name: "team",
        label: "Team-Mitglieder",
        path: "content/team",
        format: "md",
        fields: [
          { type: "string", name: "name", label: "Name", isTitle: true, required: true },
          { type: "string", name: "role", label: "Position/Rolle", required: true },
          {
            type: "string",
            name: "department",
            label: "Abteilung",
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
          { type: "image", name: "photo", label: "Foto" },
          { type: "string", name: "linkedin", label: "LinkedIn-URL" },
          { type: "rich-text", name: "body", label: "Kurzbeschreibung" },
          { type: "number", name: "order", label: "Reihenfolge" },
        ],
      },
      {
        name: "vehicle",
        label: "Fahrzeuge",
        path: "content/vehicles",
        format: "md",
        fields: [
          { type: "string", name: "name", label: "Fahrzeugname", isTitle: true, required: true },
          { type: "number", name: "year", label: "Baujahr", required: true },
          { type: "string", name: "tagline", label: "Kurzslogan" },
          { type: "image", name: "coverImage", label: "Titelbild" },
          {
            type: "object",
            name: "specs",
            label: "Technische Daten",
            list: true,
            fields: [
              { type: "string", name: "label", label: "Bezeichnung" },
              { type: "string", name: "value", label: "Wert" },
            ],
          },
          { type: "boolean", name: "current", label: "Aktuelles Fahrzeug" },
          { type: "rich-text", name: "body", label: "Beschreibung" },
        ],
      },
      {
        name: "sponsor",
        label: "Sponsoren",
        path: "content/sponsors",
        format: "md",
        fields: [
          { type: "string", name: "name", label: "Name", isTitle: true, required: true },
          {
            type: "string",
            name: "tier",
            label: "Sponsoring-Stufe",
            options: ["Platin", "Gold", "Silber", "Partner"],
            required: true,
          },
          { type: "image", name: "logo", label: "Logo" },
          { type: "string", name: "website", label: "Website-URL" },
          { type: "rich-text", name: "body", label: "Beschreibung" },
        ],
      },
      {
        name: "news",
        label: "News & Blog",
        path: "content/news",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Titel", isTitle: true, required: true },
          { type: "datetime", name: "date", label: "Datum", required: true },
          { type: "string", name: "excerpt", label: "Kurzbeschreibung" },
          { type: "image", name: "coverImage", label: "Titelbild" },
          { type: "rich-text", name: "body", label: "Inhalt", isBody: true },
        ],
      },
      {
        name: "page",
        label: "Seiteninhalte",
        path: "content/pages",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Titel", isTitle: true, required: true },
          { type: "string", name: "heroTitle", label: "Hero-Titel" },
          { type: "string", name: "heroSubtitle", label: "Hero-Untertitel" },
          { type: "rich-text", name: "body", label: "Inhalt" },
        ],
      },
      {
        name: "blog",
        label: "Blog",
        path: "content/blog",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Titel", isTitle: true, required: true },
          { type: "datetime", name: "date", label: "Datum", required: true },
          { type: "string", name: "author", label: "Autor:in" },
          { type: "string", name: "excerpt", label: "Kurzbeschreibung" },
          { type: "image", name: "coverImage", label: "Titelbild" },
          { type: "rich-text", name: "body", label: "Inhalt", isBody: true },
        ],
      },
      {
        name: "galleryImage",
        label: "Galerie",
        path: "content/gallery",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Titel", isTitle: true, required: true },
          { type: "image", name: "image", label: "Bild", required: true },
          {
            type: "string",
            name: "category",
            label: "Kategorie",
            options: ["Wettbewerb", "Werkstatt", "Team", "Event"],
          },
          { type: "number", name: "order", label: "Reihenfolge" },
        ],
      },
      {
        name: "result",
        label: "Erfolge",
        path: "content/results",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Titel", isTitle: true, required: true },
          { type: "number", name: "year", label: "Jahr", required: true },
          { type: "string", name: "event", label: "Wettbewerb", required: true },
          { type: "string", name: "placement", label: "Platzierung" },
          { type: "rich-text", name: "description", label: "Beschreibung" },
        ],
      },
      {
        name: "position",
        label: "Offene Positionen",
        path: "content/positions",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Titel", isTitle: true, required: true },
          { type: "string", name: "department", label: "Abteilung" },
          { type: "string", name: "commitment", label: "Umfang" },
          { type: "rich-text", name: "description", label: "Beschreibung", isBody: true },
        ],
      },
    ],
  },
});
