import LoginForm from "@/components/admin/LoginForm";

// Server-Komponente: liest den konfigurierten CMS-Benutzernamen aus der
// (nicht versionierten) .env.local und uebergibt ihn als Vorbelegung an das
// Login-Formular. Es wird nie ein Passwort oder Token an den Client geschickt -
// nur der ohnehin oeffentlich sichtbare Benutzername, damit beim Start des
// CMS nur noch das Passwort eingetippt werden muss.
export default function AdminLoginPage() {
  const defaultUsername = process.env.CMS_ADMIN_USER ?? "";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 64px)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-1/3 left-1/2 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-1/3 right-1/4 h-[50vh] w-[50vh] rounded-full bg-accent-2/20 blur-[120px]"
        aria-hidden
      />
      <LoginForm defaultUsername={defaultUsername} />
    </main>
  );
}
