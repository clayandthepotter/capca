import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] px-5 py-12 text-slate-950 sm:px-6">
      <article className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <Link href="/" className="text-sm font-semibold text-blue-700">
          Capca
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Effective date: July 13, 2026
        </p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-slate-700">
          <section>
            <h2 className="text-base font-semibold text-slate-950">
              Using Capca
            </h2>
            <p className="mt-2">
              Capca is provided to help you record, store, and share screen
              recordings. You are responsible for using Capca lawfully and for
              getting consent before recording people, meetings, private
              systems, or sensitive information.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-950">
              Your content
            </h2>
            <p className="mt-2">
              You keep ownership of your recordings. When you save recordings
              to Google Drive, those files remain in your Google account. When
              you use Capca Cloud or share links, you authorize Capca to store,
              process, and serve the content as needed to provide the service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-950">
              Prohibited use
            </h2>
            <p className="mt-2">
              Do not use Capca to violate laws, infringe rights, distribute
              malware, bypass access controls, harass others, or record content
              you do not have permission to capture or share.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-950">
              Availability
            </h2>
            <p className="mt-2">
              Capca may change, pause, or discontinue features. Browser,
              network, Google Drive, and storage-provider limits may affect
              recording, uploading, and sharing.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-950">
              Disclaimer
            </h2>
            <p className="mt-2">
              Capca is provided as-is without warranties to the maximum extent
              allowed by law. Capca is not liable for lost recordings, failed
              uploads, interrupted service, or misuse of the product.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
