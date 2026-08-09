import { SITE_URL } from "@/lib/site";

/**
 * Site-wide JSON-LD (schema.org SportsTeam) so search engines can pick up
 * the team's identity, contact details and social profiles directly from
 * every page without extra crawling.
 */
export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: "E-Motion Rennteam Aalen",
    alternateName: "E-Motion Rennteam",
    url: SITE_URL,
    logo: `${SITE_URL}/uploads/logo.png`,
    sport: "Motorsport",
    description:
      "E-Motion Rennteam Aalen ist das Formula-Student-Electric-Team der Hochschule Aalen.",
    email: "vorstand@emotion-rennteam.de",
    telephone: "+49-7361-5762191",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Beethovenstraße 1",
      postalCode: "73430",
      addressLocality: "Aalen",
      addressCountry: "DE",
    },
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "Hochschule Aalen",
    },
    memberOf: {
      "@type": "Organization",
      name: "Formula Student Germany",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
