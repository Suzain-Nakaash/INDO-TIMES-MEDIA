"use client";

import { useState } from "react";
import { useSubscribe } from "@/lib/hooks/useNewsletter";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const subscribe = useSubscribe();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg("");

    subscribe.mutate(email, {
      onSuccess: () => {
        setStatus("success");
        setEmail("");
      },
      onError: (err) => {
        setStatus("error");
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Something went wrong. Please try again.";
        setErrorMsg(message);
      },
    });
  };

  return (
    <section className="w-full py-20 bg-background border-b border-border">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="font-editorial text-4xl font-bold text-foreground mb-4">
          The Daily Briefing
        </h2>
        <p className="font-body text-lg text-muted-foreground mb-8">
          Start your day with the stories you need to know. Sign up to receive our morning newsletter delivered directly to your inbox.
        </p>
        
        <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 border-2 border-foreground p-3 text-base outline-none focus:ring-2 focus:ring-primary font-body"
            required
          />
          <button
            type="submit"
            disabled={subscribe.isPending}
            className="bg-foreground text-background px-8 py-3 font-bold uppercase tracking-widest hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {subscribe.isPending ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {status === "success" && (
          <p className="font-body text-sm text-green-600 mt-4 font-medium">
            ✓ Successfully subscribed! Check your inbox.
          </p>
        )}
        {status === "error" && (
          <p className="font-body text-sm text-red-600 mt-4 font-medium">
            {errorMsg}
          </p>
        )}
        
        <p className="font-body text-xs text-muted-foreground mt-4">
          By subscribing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </section>
  );
}
