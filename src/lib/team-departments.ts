// No filesystem access here (unlike src/lib/content.ts) so this can be
// imported from client components (e.g. the CMS admin UI) without pulling
// `fs` into the browser bundle.

/**
 * Official list of the team's specialist groups, in display order. Single
 * source of truth so the Team page, the homepage stat, the Mitmachen
 * application form, and the CMS admin UI can't drift apart again.
 */
export const TEAM_DEPARTMENTS = [
  "Board",
  "Workshop",
  "Aerodynamics",
  "Chassis and Ergonomics",
  "Suspension and Steering Systems",
  "Powertrain",
  "Electrics",
  "Vehicle Performance",
  "Driverless",
  "Media and Marketing",
  "Business Plan / Statistics",
  "Sponsoring",
  "Event Management",
  "Finance",
] as const;

/**
 * Grouping of TEAM_DEPARTMENTS into the team's three organizational units
 * (Board / Workshop / Media and Marketing), for org-chart-style display on
 * the Team page. "Workshop" and "Media and Marketing" stay selectable
 * departments themselves (for members without a more specific sub-team),
 * in addition to heading their respective sub-teams.
 */
export const TEAM_STRUCTURE = [
  { category: "Board", departments: ["Board"] },
  {
    category: "Workshop",
    departments: [
      "Workshop",
      "Aerodynamics",
      "Chassis and Ergonomics",
      "Suspension and Steering Systems",
      "Powertrain",
      "Electrics",
      "Vehicle Performance",
      "Driverless",
    ],
  },
  {
    category: "Media and Marketing",
    departments: [
      "Media and Marketing",
      "Business Plan / Statistics",
      "Sponsoring",
      "Event Management",
      "Finance",
    ],
  },
] as const;
