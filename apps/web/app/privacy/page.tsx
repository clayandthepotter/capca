import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] px-5 py-12 text-slate-950 sm:px-6">
      <article className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <Link href="/" className="text-sm font-semibold text-blue-700">
          Capca
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Effective date: July 13, 2026
        </p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-slate-700">
          <section>
            <h2 className="text-base font-semibold text-slate-950">
              What Capca collects
            </h2>
            <p className="mt-2">
              Capca stores account information you provide, such as your name
              and email address, plus recording metadata needed to show your
              library, upload status, storage usage, and share links.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-950">
              Recordings and Google Drive
            </h2>
            <p className="mt-2">
              If you connect Google Drive, Capca requests access needed to
              create and manage Capca-created files in your Drive. Your source
              recordings remain in your Google Drive when you choose that
              destination. If you choose local-only recording, the extension
              downloads the file to your device and does not add it to your
              Capca dashboard when you are signed out.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-950">
              How data is used
            </h2>
            <p className="mt-2">
              Capca uses your data to provide recording, upload, dashboard,
              Drive connection, and sharing features. Capca does not sell your
              personal information.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-950">
              Deleting data
            </h2>
            <p className="mt-2">
              You can delete recording metadata from your dashboard. Files
              stored in your Google Drive remain under your Google account and
              can be managed or deleted there.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-950">Contact</h2>
            <p className="mt-2">
              For privacy questions, open an issue in the Capca GitHub
              repository or contact the project maintainer through the published
              project channels.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
