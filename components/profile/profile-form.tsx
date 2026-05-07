"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/api/client";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
});
type FormInput = z.infer<typeof schema>;

export function ProfileForm({
  initialName,
  email,
  disclaimerAcceptedAt,
  role,
}: {
  initialName: string;
  email: string;
  disclaimerAcceptedAt: string | null;
  role: "admin" | "user";
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: { name: initialName },
  });

  const onSubmit = async (values: FormInput) => {
    setServerError(null);
    setSaved(false);
    try {
      await updateProfile({ name: values.name });
      setSaved(true);
      router.refresh();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Couldn't save profile");
    }
  };

  const onSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError ? (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        ) : null}
        {saved ? (
          <Alert>
            <AlertDescription>Saved.</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" className="h-11" {...register("name")} />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={email} disabled className="h-11" />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="h-11 w-full rounded-full"
        >
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
      </form>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded-lg border bg-muted/30 p-4 text-sm">
        <dt className="text-muted-foreground">Role</dt>
        <dd className="text-foreground">{role}</dd>
        <dt className="text-muted-foreground">Disclaimer accepted</dt>
        <dd className="text-foreground">
          {disclaimerAcceptedAt
            ? new Date(disclaimerAcceptedAt).toLocaleString()
            : "Not yet"}
        </dd>
      </dl>

      <Button
        type="button"
        variant="outline"
        onClick={onSignOut}
        className="h-11 w-full rounded-full"
      >
        Sign out
      </Button>
    </div>
  );
}
