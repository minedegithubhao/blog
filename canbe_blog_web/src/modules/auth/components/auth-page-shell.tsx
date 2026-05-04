import Link from "next/link";
import type { ReactNode } from "react";

export function AuthPageShell({
  title,
  description,
  asideTitle,
  asideDescription,
  children
}: {
  title: string;
  description: string;
  asideTitle: string;
  asideDescription: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <div className="flex min-h-screen font-sans">
        <section className="relative hidden w-1/2 overflow-hidden bg-[#3F3FF3] lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.22),transparent_28%),radial-gradient(circle_at_78%_68%,rgba(255,255,255,.18),transparent_30%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between px-12 py-12">
            <Link href="/" className="flex w-fit items-center">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                <div className="h-4 w-4 rounded-sm bg-[#3F3FF3]" />
              </div>
              <h1 className="text-xl font-semibold text-white">Canbe Blog</h1>
            </Link>

            <div className="flex flex-1 flex-col justify-center">
              <h2 className="mb-6 max-w-xl text-4xl leading-tight text-white">{asideTitle}</h2>
              <p className="max-w-xl text-lg leading-relaxed text-white/90">{asideDescription}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-white/70">
              <span>Copyright © 2026 Canbe Blog.</span>
              <span>Performance first.</span>
            </div>
          </div>
        </section>

        <section className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2">
          <div className="w-full max-w-md space-y-8">
            <div className="mb-8 text-center lg:hidden">
              <Link href="/" className="inline-flex flex-col items-center">
                <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#3F3FF3]">
                  <div className="h-4 w-4 rounded-sm bg-white" />
                </div>
                <h1 className="text-xl font-semibold text-[#171717]">Canbe Blog</h1>
              </Link>
            </div>

            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl text-[#171717]">{title}</h2>
                <p className="text-[#737373]">{description}</p>
              </div>

              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
