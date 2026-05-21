"use client";

import { useRef, useState } from "react";

type CopyEmailProps = {
  email: string;
};

export function CopyEmail({ email }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copyEmail() {
    await navigator.clipboard.writeText(email);

    setCopied(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
      timeoutRef.current = null;
    }, 1200);
  }

  return (
    <span className="copy-email">
      <button className="copy-email__button" type="button" onClick={copyEmail}>
        {email}
      </button>
      <span className="copy-email__status" aria-live="polite">
        {copied ? "(copied to clipboard)" : ""}
      </span>
    </span>
  );
}
