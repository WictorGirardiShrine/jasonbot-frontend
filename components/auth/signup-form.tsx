"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  DISCLAIMER_TEXT,
  signupSchema,
  type SignupInput,
} from "@/lib/schemas/auth";

export function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { disclaimerAccepted: false },
  });

  const disclaimerAccepted = watch("disclaimerAccepted");

  const onSubmit = async (values: SignupInput) => {
    setServerError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          name: values.name,
          disclaimer_accepted_at: new Date().toISOString(),
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    router.replace("/verify-email");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError ? (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="How should we call you?"
          autoComplete="name"
          className="h-11"
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          className="h-11"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          className="h-11"
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        ) : null}
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border bg-muted/30 p-3">
        <Checkbox
          id="disclaimer"
          checked={disclaimerAccepted}
          onCheckedChange={(v) => setValue("disclaimerAccepted", v === true, { shouldValidate: true })}
          className="mt-0.5"
        />
        <Label htmlFor="disclaimer" className="text-xs leading-snug font-normal text-muted-foreground">
          {DISCLAIMER_TEXT}
        </Label>
      </div>
      {errors.disclaimerAccepted ? (
        <p className="text-xs text-destructive">{errors.disclaimerAccepted.message}</p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting || !disclaimerAccepted}
        className="h-11 w-full rounded-full text-sm font-medium"
      >
        {isSubmitting ? "Creating account…" : "Sign up"}
      </Button>
    </form>
  );
}
