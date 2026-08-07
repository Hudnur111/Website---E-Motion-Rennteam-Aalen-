import Image from "next/image";
import { getTeam } from "@/lib/content";

export const metadata = { title: "Team | E-Motion Rennteam Aalen" };

export default function TeamPage() {
  const team = getTeam();
  const departments = Array.from(new Set(team.map((m) => m.department)));

  return (
    <div className="container-page py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">Team</p>
      <h1 className="mt-2 text-4xl font-extrabold">Die Köpfe hinter dem EM23</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Über 60 Studierende verschiedenster Fachrichtungen entwickeln, fertigen und testen
        gemeinsam unseren elektrischen Rennwagen.
      </p>

      {departments.map((department) => (
        <div key={department} className="mt-14">
          <h2 className="border-b border-border pb-3 text-xl font-bold">{department}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team
              .filter((member) => member.department === department)
              .map((member) => (
                <div
                  key={member.slug}
                  className="rounded-xl border border-border bg-surface p-5"
                >
                  <div className="aspect-square overflow-hidden rounded-lg bg-surface-2">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 font-semibold">{member.name}</h3>
                  <p className="text-sm text-accent">{member.role}</p>
                  {member.body && (
                    <p className="mt-2 text-sm text-muted">{member.body}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
