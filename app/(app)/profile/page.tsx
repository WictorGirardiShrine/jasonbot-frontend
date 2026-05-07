import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProfileForm } from "@/components/profile/profile-form";
import { getMeServer } from "@/lib/api/server";

export const metadata = { title: "Profile — JasonBot" };

export default async function ProfilePage() {
  const me = await getMeServer();

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
      <Link
        href="/chat"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to chat
      </Link>

      <h1 className="mt-8 font-heading text-4xl font-semibold tracking-tight">Profile</h1>
      <p className="mt-2 text-sm text-muted-foreground">Update your name or sign out.</p>

      <div className="mt-8">
        <ProfileForm
          initialName={me.name}
          email={me.email}
          disclaimerAcceptedAt={me.disclaimerAcceptedAt}
          role={me.role}
        />
      </div>
    </main>
  );
}
