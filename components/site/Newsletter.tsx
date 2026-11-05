"use client";

import { useState } from "react";

/** Demo only: nothing is stored or sent. Wire to a mailing list provider for a real launch. */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  return (
    <div>
      <h2 className="font-display text-xl font-black tracking-wide text-ochre">What&apos;s on</h2>
      <p className="mt-3 text-sm text-bone/80">New events, brunch specials and the odd free brochette. Once a month.</p>
      {state === "done" ? (
        <p role="status" className="mt-4 rounded-xl bg-bone/10 px-4 py-3 text-sm font-semibold">You&apos;re on the list. See you by the fire.</p>
      ) : (
        <form noValidate className="mt-4 flex gap-2" onSubmit={(e) => {
          e.preventDefault();
          setState(/^\S+@\S+\.\S+$/.test(email) ? "done" : "error");
        }}>
          <label className="sr-only" htmlFor="nl-email">Email</label>
          <input id="nl-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setState("idle"); }} placeholder="you@email.com"
            autoComplete="email" aria-invalid={state === "error"}
            className="min-w-0 flex-1 rounded-full border-2 border-bone/25 bg-char/30 px-4 py-2.5 text-sm text-bone placeholder:text-bone/40 focus:border-ochre focus:outline-none" />
          <button className="rounded-full bg-ember px-4 py-2.5 text-sm font-bold text-white hover:bg-ember-deep">Join</button>
        </form>
      )}
      {state === "error" && <p role="alert" className="mt-2 text-sm font-semibold text-ochre">That email doesn&apos;t look right.</p>}
    </div>
  );
}
