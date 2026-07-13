import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { auth } from "@/lib/auth";
import { SidebarNav } from "./sidebar-nav";
import { SignOutButton } from "./settings/sign-out-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white sm:flex">
        <BrandLogo href="/" className="px-5 py-5" />

        <SidebarNav />

        <div className="border-t border-slate-200 p-4">
          <p className="truncate text-xs font-medium text-slate-500">
            {session.user.name}
          </p>
          <p className="truncate text-xs text-slate-400">{session.user.email}</p>
          <div className="mt-3">
            <SignOutButton compact />
          </div>
        </div>
      </aside>

      <div className="flex-1">{children}</div>
    </div>
  );
}
