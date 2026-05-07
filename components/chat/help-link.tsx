import Link from "next/link";
import { Lightbulb } from "lucide-react";

export function HelpLink() {
  return (
    <Link
      href="/how-it-works"
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
    >
      <Lightbulb className="size-3.5" />
      New here? See how this chat works →
    </Link>
  );
}
