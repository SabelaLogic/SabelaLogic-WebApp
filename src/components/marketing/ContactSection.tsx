"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CONTACT, NEED_OPTIONS, WHEN_OPTIONS } from "@/lib/data/site-content";

interface FormState {
  name: string;
  contact: string;
  type: string;
  when: string;
  brief: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  contact: "",
  type: "Web app MVP",
  when: "As soon as possible",
  brief: "",
};

export function ContactSection({ eyebrow = "07 / CONTACT" }: { eyebrow?: string }) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentVia, setSentVia] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const onHandoff = (ev: Event) => {
      const detail = (ev as CustomEvent<{ kind: string; generated: string }>).detail;
      if (!detail) return;
      setForm((f) => ({
        ...f,
        type: detail.kind || f.type,
        brief: f.brief + "\n\n--- generated build brief ---\n" + detail.generated,
      }));
    };
    window.addEventListener("sabelalogic:send-to-brief", onHandoff);
    return () => window.removeEventListener("sabelalogic:send-to-brief", onHandoff);
  }, []);

  const setField = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setFormError("");
  };

  const wa = CONTACT.whatsappNumber.replace(/[^0-9]/g, "");
  const waDisplay = "+" + wa.replace(/^(\d{2})(\d{2})(\d{3})(\d{4})$/, "$1 $2 $3 $4");
  const waLink = "https://wa.me/" + wa;
  const mailLink = "mailto:" + CONTACT.email + "?subject=" + encodeURIComponent("Project brief — Sabela Logic");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.brief.trim()) {
      setFormError("Name, contact and brief are all needed before I can quote.");
      return;
    }
    setSending(true);
    setFormError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "sabelalogic.co.za" }),
      });
      if (!res.ok) throw new Error("bad status");
      setSending(false);
      setSent(true);
      setSentVia("email");
      return;
    } catch {
      // fall through to WhatsApp
    }
    const msg = [
      "New brief from sabelalogic.co.za",
      "",
      "Name: " + form.name,
      "Contact: " + form.contact,
      "Needs: " + form.type,
      "Timeline: " + form.when,
      "",
      form.brief,
    ].join("\n");
    window.open("https://wa.me/" + wa + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    setSending(false);
    setSent(true);
    setSentVia("whatsapp");
  };

  const resetForm = () => {
    setSent(false);
    setSentVia("");
    setForm(INITIAL_FORM);
  };

  return (
    <section id="contact" className="border-b border-hairline px-[clamp(16px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[clamp(28px,5vw,64px)]">
        <div>
          <div className="mb-3.5 text-[11px] tracking-[0.22em] text-signal">{eyebrow}</div>
          <h2 className="mb-5 font-display text-[clamp(28px,4.4vw,50px)] leading-[1.04] font-extrabold tracking-[-0.025em]">
            Let&rsquo;s scope it.
          </h2>
          <p className="mb-[30px] max-w-[40ch] text-[14px] leading-[1.75] text-bone-dim" style={{ textWrap: "pretty" }}>
            Send the brief and you&rsquo;ll have a fixed quote and a delivery date back within 24 hours. If
            it isn&rsquo;t a fit I&rsquo;ll say so quickly and point you somewhere better.
          </p>
          <div className="mb-8 flex flex-col gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-between gap-3.5 rounded-[2px] border border-[#332f2d] px-5 py-4 text-bone transition-colors hover:border-signal hover:bg-[#141110]"
            >
              <span className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.16em] text-grey">FASTEST</span>
                <span className="text-[14px] font-bold">WhatsApp</span>
              </span>
              <span className="text-[12px] text-signal">{waDisplay} ↗</span>
            </a>
            <a
              href={mailLink}
              className="flex items-center justify-between gap-3.5 rounded-[2px] border border-[#332f2d] px-5 py-4 text-bone transition-colors hover:border-signal hover:bg-[#141110]"
            >
              <span className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.16em] text-grey">EMAIL</span>
                <span className="text-[14px] font-bold">Written brief</span>
              </span>
              <span className="text-[12px] text-signal">{CONTACT.email} ↗</span>
            </a>
          </div>
          <div className="grid grid-cols-[88px_1fr] items-start gap-[18px] border border-hairline bg-ink-raised p-5">
            <Image
              src="https://sabelalogic26.firebaseapp.com/lunga_portrait.jpg"
              alt="Lunga Xhamela"
              width={88}
              height={104}
              className="h-[104px] w-[88px] border border-[#2b2827] bg-[#151413] object-cover"
              style={{ objectPosition: "52% 22%", filter: "grayscale(100%) contrast(118%)" }}
              unoptimized
            />
            <div>
              <div className="mb-3 text-[10.5px] tracking-[0.16em] text-grey">OPERATOR</div>
              <div className="mb-[7px] text-[14px] font-bold">Lunga Xhamela</div>
              <p className="m-0 text-[12px] leading-[1.7] text-grey" style={{ textWrap: "pretty" }}>
                Sole architect and engineer. You brief me, I build it, I hand it over — no account layer in
                between, no work passed to someone you haven&rsquo;t met.
              </p>
            </div>
          </div>
        </div>

        <div className="border border-hairline bg-ink-raised p-[clamp(20px,3vw,32px)]">
          {sent ? (
            <div className="flex flex-col gap-4 py-5">
              <div className="text-[26px] text-signal">✓</div>
              <div className="text-[16px] font-bold">Brief received.</div>
              <p className="m-0 text-[13px] leading-[1.75] text-bone-dim">
                {sentVia === "whatsapp"
                  ? "WhatsApp should have opened with your brief ready to send — press send there and it reaches me directly. Quote and delivery date back within 24 hours."
                  : "It is in my inbox. You will have a fixed quote and a delivery date back within 24 hours."}
              </p>
              <button
                onClick={resetForm}
                className="mt-1.5 self-start rounded-[2px] border border-[#332f2d] bg-transparent px-[18px] py-[11px] text-[12px] text-bone hover:border-signal hover:text-signal"
              >
                SEND ANOTHER
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3.5">
                <label className="flex flex-col gap-2.5">
                  <span className="text-[10.5px] tracking-[0.14em] text-grey">NAME</span>
                  <input
                    value={form.name}
                    onChange={setField("name")}
                    required
                    placeholder="Your name"
                    className="sl-field rounded-[2px] border border-[#2b2827] bg-ink px-[13px] py-3 text-[13px] text-bone outline-none"
                  />
                </label>
                <label className="flex flex-col gap-2.5">
                  <span className="text-[10.5px] tracking-[0.14em] text-grey">EMAIL OR WHATSAPP</span>
                  <input
                    value={form.contact}
                    onChange={setField("contact")}
                    required
                    placeholder="you@company.co.za"
                    className="sl-field rounded-[2px] border border-[#2b2827] bg-ink px-[13px] py-3 text-[13px] text-bone outline-none"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2.5">
                <span className="text-[10.5px] tracking-[0.14em] text-grey">WHAT DO YOU NEED?</span>
                <select
                  value={form.type}
                  onChange={setField("type")}
                  className="sl-field rounded-[2px] border border-[#2b2827] bg-ink px-[13px] py-3 text-[13px] text-bone outline-none"
                >
                  {NEED_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2.5">
                <span className="text-[10.5px] tracking-[0.14em] text-grey">WHEN DO YOU NEED IT?</span>
                <select
                  value={form.when}
                  onChange={setField("when")}
                  className="sl-field rounded-[2px] border border-[#2b2827] bg-ink px-[13px] py-3 text-[13px] text-bone outline-none"
                >
                  {WHEN_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2.5">
                <span className="text-[10.5px] tracking-[0.14em] text-grey">THE BRIEF</span>
                <textarea
                  value={form.brief}
                  onChange={setField("brief")}
                  required
                  rows={6}
                  placeholder="What it should do, who uses it, and anything that already exists."
                  className="sl-field resize-y rounded-[2px] border border-[#2b2827] bg-ink px-[13px] py-3 text-[13px] leading-[1.7] text-bone outline-none"
                />
              </label>
              {formError && (
                <div className="border border-[#4d3520] bg-[#1a1210] px-3.5 py-3 text-[12px] leading-[1.6] text-[#f2c98b]">
                  {formError}
                </div>
              )}
              <button
                type="submit"
                disabled={sending}
                className={
                  "w-full rounded-[2px] border border-signal px-[22px] py-[15px] text-[13px] font-bold tracking-[0.06em] transition-all " +
                  (sending ? "cursor-wait bg-[#241412] text-signal" : "cursor-pointer bg-signal text-ink")
                }
                style={sending ? undefined : { boxShadow: "rgba(224,74,58,0.26) 0 1px 3px 0, rgba(0,0,0,0.5) 0 4px 8px 3px" }}
              >
                {sending ? "SENDING…" : "SEND THE BRIEF →"}
              </button>
              <p className="m-0 text-[11px] leading-[1.7] text-grey-darker">
                This opens WhatsApp with your brief composed and ready to send.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
