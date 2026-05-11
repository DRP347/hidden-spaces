"use client";

import { Check, Copy, Instagram, Send } from "lucide-react";
import { useMemo, useState } from "react";

type ShareButtonsProps = {
  title: string;
  url: string;
  className?: string;
};

export function ShareButtons({ title, url, className = "" }: ShareButtonsProps) {
  const [message, setMessage] = useState("");
  const [showManualCopy, setShowManualCopy] = useState(false);
  const shareText = useMemo(() => `${title} on Hidden Spaces Daman: ${url}`, [title, url]);
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  async function copyLink(nextMessage = "Link copied") {
    try {
      if (copyWithTextarea(url)) {
        setShowManualCopy(false);
        setMessage(nextMessage);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShowManualCopy(false);
        setMessage(nextMessage);
      } else {
        throw new Error("Clipboard unavailable");
      }
      window.setTimeout(() => {
        setMessage("");
        setShowManualCopy(false);
      }, 2600);
    } catch {
      setShowManualCopy(true);
      setMessage("Copy this link:");
      window.setTimeout(() => {
        setMessage("");
        setShowManualCopy(false);
      }, 8000);
    }
  }

  return (
    <div className={`share-actions ${className}`}>
      <div className="flex flex-wrap gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="secondary-button min-h-10 px-3 text-xs"
        >
          <Send className="h-4 w-4" />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={() => copyLink()}
          className="secondary-button min-h-10 px-3 text-xs"
        >
          {message === "Link copied" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          Copy link
        </button>
        <button
          type="button"
          onClick={() => copyLink("Link copied. Paste it in your Instagram story or DM.")}
          className="secondary-button min-h-10 px-3 text-xs"
        >
          <Instagram className="h-4 w-4" />
          Instagram
        </button>
      </div>
      {message ? (
        <p className="mt-2 text-xs font-semibold text-[#395B45]" role="status">
          {message}
        </p>
      ) : null}
      {showManualCopy ? (
        <input
          readOnly
          value={url}
          className="mt-2 w-full rounded-full border border-[#eadcc8] bg-white/80 px-3 py-2 text-xs font-semibold text-[#473b2e]"
          onFocus={(event) => event.currentTarget.select()}
          aria-label="Share link"
        />
      ) : null}
    </div>
  );
}

function copyWithTextarea(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}
