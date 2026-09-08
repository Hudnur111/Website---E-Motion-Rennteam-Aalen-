import type { Vehicle } from "@/lib/content";

export default function TerminalSpecs({
  specs,
  achievements,
}: {
  specs: NonNullable<Vehicle["specs"]>;
  achievements?: Vehicle["achievements"];
}) {
  return (
    <div className="mt-6">
      <dl className="space-y-2">
        {specs.map((s) => (
          <div key={s.label} className="flex flex-wrap gap-x-2 text-sm">
            <dt className="font-semibold text-foreground">{s.label}:</dt>
            <dd className="text-foreground">{s.value}</dd>
          </div>
        ))}
      </dl>

      {achievements && achievements.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {achievements.map((achievement) => (
            <li key={achievement} className="text-sm text-foreground">
              {achievement}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
