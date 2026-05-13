"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { spotCategories } from "@/types/spot";

type SubmitState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

const initialState = {
  name: "",
  area: "",
  category: "Peaceful",
  reason: "",
  bestTime: "",
  mapsLink: "",
  submitterName: "",
  submitterContact: "",
  notes: "",
};

export function SubmitSpotForm() {
  const [form, setForm] = useState(initialState);
  const [state, setState] = useState<SubmitState>({ status: "idle", message: "" });

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting", message: "" });

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setState({
          status: "error",
          message: data?.message ?? "Unable to submit this spot right now.",
        });
        return;
      }

      setForm(initialState);
      setState({
        status: "success",
        message: data?.message ?? "Thanks. I’ll review it before adding it to the map.",
      });
    } catch {
      setState({
        status: "error",
        message: "Unable to submit this spot right now. Please try again.",
      });
    }
  }

  const isSubmitting = state.status === "submitting";

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Spot name" required>
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
            maxLength={120}
            placeholder="Example: quiet jetty corner"
            className="form-field"
          />
        </Field>
        <Field label="Area or neighbourhood" required>
          <input
            value={form.area}
            onChange={(event) => updateField("area", event.target.value)}
            required
            maxLength={120}
            placeholder="Nani Daman, Moti Daman, Devka..."
            className="form-field"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category">
          <select
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="form-field"
          >
            {spotCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Best time to visit">
          <input
            value={form.bestTime}
            onChange={(event) => updateField("bestTime", event.target.value)}
            maxLength={160}
            placeholder="Early morning, sunset, after 5 PM..."
            className="form-field"
          />
        </Field>
      </div>

      <Field label="Why is it worth visiting?" required>
        <textarea
          value={form.reason}
          onChange={(event) => updateField("reason", event.target.value)}
          required
          maxLength={1200}
          rows={5}
          placeholder="Tell me what makes it useful: quiet, scenic, good for photos, easy to reach, good food nearby..."
          className="form-field resize-y"
        />
      </Field>

      <Field label="Google Maps link or coordinates">
        <input
          value={form.mapsLink}
          onChange={(event) => updateField("mapsLink", event.target.value)}
          maxLength={500}
          placeholder="Paste a Google Maps link, or type lat/lng if you know it"
          className="form-field"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name (optional)">
          <input
            value={form.submitterName}
            onChange={(event) => updateField("submitterName", event.target.value)}
            maxLength={120}
            placeholder="Only if you want to share"
            className="form-field"
          />
        </Field>
        <Field label="Contact (optional)">
          <input
            value={form.submitterContact}
            onChange={(event) => updateField("submitterContact", event.target.value)}
            maxLength={180}
            placeholder="Email or Instagram handle"
            className="form-field"
          />
        </Field>
      </div>

      <Field label="Extra notes (optional)">
        <textarea
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="Anything else I should know before adding it?"
          className="form-field resize-y"
        />
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-5 text-[#7a6d5b]">
          Submissions are reviewed before publishing so the map stays useful.
          Contact is optional if you want an update when the spot is added.
        </p>
        <button type="submit" disabled={isSubmitting} className="primary-button">
          <Send className="h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Submit spot"}
        </button>
      </div>

      {state.message ? (
        <p
          className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
            state.status === "success"
              ? "bg-[#EFF4EF] text-[#395B45]"
              : "bg-[#FFF1ED] text-[#9E3F2F]"
          }`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#473b2e]">
      <span>
        {label}
        {required ? <span className="text-[#9E3F2F]"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
