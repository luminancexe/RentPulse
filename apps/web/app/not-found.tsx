import Link from "next/link";
import { EditorialButton } from "@/components/ui/EditorialButton";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas text-ink-primary flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md bg-surface p-8 rounded-3xl border border-hairline shadow-subtle">
        <span className="text-xs font-semibold uppercase tracking-wider text-forest bg-forest-light px-3 py-1 rounded-full">
          404 Not Found
        </span>
        <h1 className="font-display text-3xl font-normal text-ink-primary mt-4 mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-ink-secondary mb-6 leading-relaxed">
          The residence or discovery view you requested could not be located in our Dhaka spatial matrix.
        </p>
        <Link href="/properties">
          <EditorialButton variant="primary">
            Back to Properties
          </EditorialButton>
        </Link>
      </div>
    </div>
  );
}
