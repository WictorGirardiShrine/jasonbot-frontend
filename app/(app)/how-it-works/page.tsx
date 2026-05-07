import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const metadata = { title: "How this chat works — JasonBot" };

const FAQ: { q: string; a: string }[] = [
  {
    q: "How do I use this chat?",
    a: "There's nothing to learn. Open a session, read what JasonBot says, and reply honestly with whatever comes up. Short answers are fine. You can take as long as you need between messages — nothing here is rushed.",
  },
  {
    q: "What is JasonBot actually doing?",
    a: "It walks you through a gentle process for noticing how anxiety shows up for you, then helps you shift the way you experience it. It's a guide, not a test. There are no right or wrong answers.",
  },
  {
    q: "Is what I share private?",
    a: "Your sessions are stored to your account so you can come back to them. You can delete any session at any time, and only you (and Jason, if you flag something for review) can see your messages.",
  },
  {
    q: "Can I delete a session?",
    a: "Yes — open the menu next to any session in the sidebar and choose Delete. You can also rename sessions to whatever feels useful, like 'Work anxiety' or 'Sleep'.",
  },
  {
    q: "What if I get stuck or it feels too much?",
    a: "It's okay to pause. Close the tab, take a breath, come back later. If something comes up that needs a real person, please reach out to a friend, a professional, or your local emergency services. JasonBot is a self-guided tool, not a replacement for care.",
  },
  {
    q: "Do I need to 'do it right'?",
    a: "No. There's no right way to do this. If you don't know an answer, guess. If a question doesn't fit, say so. The process works as long as you're honest with yourself.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-10">
      <Link
        href="/chat"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to chat
      </Link>

      <h1 className="mt-8 font-heading text-4xl font-semibold tracking-tight">How this chat works</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        You&apos;re in control here. Take your time, answer as honestly as you can, and know that you can pause, rename, or delete anything whenever you want.
      </p>

      <Accordion type="single" collapsible className="mt-8">
        {FAQ.map(({ q, a }) => (
          <AccordionItem key={q} value={q}>
            <AccordionTrigger className="text-base font-semibold">{q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
              {a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-10 flex justify-center">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/chat">Back to chat</Link>
        </Button>
      </div>
    </main>
  );
}
