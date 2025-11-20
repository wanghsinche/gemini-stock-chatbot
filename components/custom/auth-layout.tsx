import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="hidden bg-zinc-900 lg:flex lg:flex-col lg:p-12 text-white">
        <div className="flex align-center justify-center h-3/4 mb-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/gemini-logo.png"
            alt="AI Investment Advisor"
            width={32}
            height={32}
          />
          <span className="text-xl font-semibold">AI Investment Advisor</span>
        </Link>
        <div className="mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This open-source AI stock investment agent revolutionized my trading with one-click deployment.
              &rdquo;
            </p>
            <footer className="text-sm text-zinc-400">
              - Susan W., Individual Trader
            </footer>
          </blockquote>
        </div>

        </div>
      </div>
      <div className="flex items-center justify-center py-12">{children}</div>
    </div>
  );
}
