"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// CONFIG — replace these two values with the real Ayaan-Tinashe Supabase
// project details once that project exists. Until then this write is
// best-effort and failing it silently does NOT block onboarding — the gate
// SabelaLogic actually checks is the /api/acceptance call below, against our
// own D1 database. Once real credentials land here, the legal record starts
// being written too, with no other code changes needed.
const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";
const TABLE_NAME = "agreement_acknowledgements";
const DOCUMENT_VERSION = "2026-09-06";

async function getIP(): Promise<string> {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = (await res.json()) as { ip?: string };
    return data.ip ?? "unavailable";
  } catch {
    return "unavailable";
  }
}

async function recordLegalAcknowledgement(record: {
  full_name: string;
  title: string;
  accepted_sla: boolean;
  accepted_privacy_policy: boolean;
  ip_address: string;
  accepted_at: string;
  document_version: string;
}) {
  if (SUPABASE_URL.includes("YOUR-PROJECT")) return; // not configured yet — skip quietly
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(record),
    });
  } catch (err) {
    console.warn("Legal-record write skipped:", err);
  }
}

export function AcceptanceForm({ clientName }: { clientName: string }) {
  const router = useRouter();
  const [ackSLA, setAckSLA] = useState(false);
  const [ackPrivacy, setAckPrivacy] = useState(false);
  const [signName, setSignName] = useState("");
  const [signTitle, setSignTitle] = useState("");
  const [status, setStatus] = useState<{ text: string; error?: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const ready = ackSLA && ackPrivacy && signName.trim().length > 1 && signTitle.trim().length > 1;

  const submit = async () => {
    setSubmitting(true);
    setStatus({ text: "Recording your acceptance…" });

    const acceptedAt = new Date().toISOString();
    const ip = await getIP();

    try {
      const res = await fetch("/api/acceptance", { method: "POST" });
      if (!res.ok) throw new Error(`api ${res.status}`);

      await recordLegalAcknowledgement({
        full_name: signName.trim(),
        title: signTitle.trim(),
        accepted_sla: true,
        accepted_privacy_policy: true,
        ip_address: ip,
        accepted_at: acceptedAt,
        document_version: DOCUMENT_VERSION,
      });

      setAccepted(true);
      setTimeout(() => router.push("/portal"), 1800);
    } catch (err) {
      setStatus({ text: "Something went wrong recording this — please try again or contact SabelaLogic directly.", error: true });
      setSubmitting(false);
      console.error(err);
    }
  };

  return (
    <div className="ap-wrap">
      <style jsx>{`
        .ap-wrap {
          --navy-deep: #0b1f3a;
          --navy-mid: #16304f;
          --brass: #b8935a;
          --brass-light: #d4b27e;
          --paper: #f5f1e8;
          --ink: #1e1b16;
          --slate: #7c8894;
          background: var(--navy-deep);
          font-family: var(--font-sans-ui), sans-serif;
          color: var(--paper);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          padding: 48px 20px 80px;
          position: relative;
          overflow-x: hidden;
        }
        .content {
          max-width: 640px;
          width: 100%;
          position: relative;
          z-index: 1;
        }
        .masthead {
          text-align: center;
          margin-bottom: 34px;
        }
        .masthead .brand {
          font-size: 13px;
          letter-spacing: 0.04em;
          color: var(--slate);
          margin-bottom: 10px;
        }
        .masthead h1 {
          font-family: var(--font-display), serif;
          font-weight: 600;
          font-size: clamp(28px, 6vw, 38px);
          color: var(--paper);
          line-height: 1.15;
        }
        .card {
          background: var(--navy-mid);
          border: 1px solid rgba(184, 147, 90, 0.25);
          padding: 8px;
        }
        .doc-block {
          background: var(--paper);
          color: var(--ink);
          margin: 20px;
          border: 1px solid rgba(30, 27, 22, 0.15);
        }
        .doc-head {
          padding: 18px 24px 14px;
          border-bottom: 1px solid rgba(30, 27, 22, 0.12);
        }
        .doc-head h2 {
          font-family: var(--font-display), serif;
          font-weight: 600;
          font-size: 19px;
        }
        .doc-scroll {
          max-height: 260px;
          overflow-y: auto;
          padding: 16px 24px 20px;
          font-size: 13.5px;
          line-height: 1.65;
        }
        .doc-scroll h3 {
          font-size: 13px;
          margin: 14px 0 4px;
          color: var(--navy-mid);
          font-family: var(--font-display), serif;
        }
        .doc-scroll p {
          margin-bottom: 8px;
        }
        .doc-scroll ul {
          margin: 4px 0 10px 18px;
        }
        .doc-scroll li {
          margin-bottom: 4px;
        }
        .ack-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin: 14px 24px 0;
          padding-bottom: 20px;
        }
        .ack-row input[type="checkbox"] {
          appearance: none;
          width: 20px;
          height: 20px;
          border: 1.5px solid var(--brass);
          background: transparent;
          margin-top: 2px;
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
        }
        .ack-row input[type="checkbox"]:checked {
          background: var(--brass);
        }
        .ack-row input[type="checkbox"]:checked::after {
          content: "✓";
          position: absolute;
          top: -3px;
          left: 3px;
          color: var(--navy-deep);
          font-size: 14px;
          font-weight: 700;
        }
        .ack-row label {
          font-size: 13.5px;
          color: var(--paper);
          cursor: pointer;
          padding-top: 1px;
        }
        .sign-section {
          padding: 6px 24px 24px;
        }
        .sign-section .sub {
          font-family: var(--font-display), serif;
          font-size: 16px;
          color: var(--paper);
          margin-bottom: 16px;
        }
        .field-row {
          display: flex;
          gap: 14px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .field {
          flex: 1;
          min-width: 200px;
        }
        .field label {
          display: block;
          font-size: 11.5px;
          color: var(--slate);
          margin-bottom: 6px;
        }
        .field input[type="text"] {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid var(--brass);
          color: var(--paper);
          font-family: var(--font-sans-ui), sans-serif;
          font-size: 15px;
          padding: 6px 2px 8px;
        }
        .field input[type="text"]:focus {
          outline: none;
          border-bottom-color: var(--brass-light);
        }
        .field input::placeholder {
          color: rgba(245, 241, 232, 0.35);
        }
        .submit-row {
          margin-top: 22px;
        }
        button {
          width: 100%;
          background: var(--brass);
          color: var(--navy-deep);
          border: none;
          font-family: var(--font-sans-ui), sans-serif;
          font-weight: 700;
          font-size: 15px;
          padding: 15px;
          cursor: pointer;
          letter-spacing: 0.01em;
        }
        button:disabled {
          background: rgba(184, 147, 90, 0.25);
          color: rgba(245, 241, 232, 0.4);
          cursor: not-allowed;
        }
        .status {
          font-size: 12.5px;
          color: var(--slate);
          margin-top: 10px;
          min-height: 16px;
          text-align: center;
        }
        .status.err {
          color: #d98080;
        }
        .stamp-view {
          text-align: center;
          padding: 60px 24px;
        }
        .stamp-ring {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 2.5px solid var(--brass);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          position: relative;
        }
        .stamp-ring::before {
          content: "";
          position: absolute;
          inset: 10px;
          border: 1px solid rgba(184, 147, 90, 0.5);
          border-radius: 50%;
        }
        .stamp-ring .check {
          font-size: 44px;
          color: var(--brass);
        }
        .stamp-view h2 {
          font-family: var(--font-display), serif;
          font-weight: 600;
          font-size: 24px;
          color: var(--paper);
          margin-bottom: 10px;
        }
        .stamp-view p {
          color: var(--slate);
          font-size: 14px;
          line-height: 1.6;
        }
        .stamp-view .meta {
          margin-top: 20px;
          font-size: 12.5px;
          color: rgba(245, 241, 232, 0.5);
        }
        @media (max-width: 480px) {
          .doc-block {
            margin: 14px;
          }
          .doc-head,
          .ack-row,
          .sign-section {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      `}</style>

      <div className="content">
        <div className="masthead">
          <div className="brand">SabelaLogic × {clientName}</div>
          <h1>Acceptance of Agreement</h1>
        </div>

        {!accepted ? (
          <div className="card">
            <div className="doc-block">
              <div className="doc-head">
                <h2>Service Level Agreement</h2>
              </div>
              <div className="doc-scroll">
                <p>
                  This SLA covers the four platforms delivered under Invoice SL-AT-2026-0902-R2 (Client
                  Application Portal, Administration Portal, LMS &amp; Content Hub, Placement &amp; Performance
                  Tracking), under the R15,260/month retainer.
                </p>
                <h3>Support Response</h3>
                <ul>
                  <li>
                    <b>Critical</b> (platform unusable): 4-business-hour first response, 1-business-day target
                    resolution
                  </li>
                  <li>
                    <b>Major</b> (module broken): 1-business-day response, 3-business-day target resolution
                  </li>
                  <li>
                    <b>Minor</b> (cosmetic): 3-business-day response, resolved next scheduled update
                  </li>
                </ul>
                <h3>Availability</h3>
                <p>
                  99% uptime during business hours is targeted on a best-effort basis. Third-party
                  infrastructure outages (hosting, SMS, payment providers) are excluded.
                </p>
                <h3>Limitation of Liability &amp; Indemnity</h3>
                <p>
                  SabelaLogic&rsquo;s liability is limited to retainer fees paid in the preceding three months,
                  except in cases of gross negligence or wilful misconduct. Ayaan-Tinashe indemnifies
                  SabelaLogic against claims arising from content or data it uploads, and from use of the
                  platforms outside this agreement&rsquo;s terms.
                </p>
                <p>
                  <i>Full terms as set out in the signed SLA document dated at retainer commencement.</i>
                </p>
              </div>
            </div>
            <div className="ack-row">
              <input
                type="checkbox"
                id="ackSLA"
                checked={ackSLA}
                onChange={(e) => setAckSLA(e.target.checked)}
              />
              <label htmlFor="ackSLA">
                I have read and accept the Service Level Agreement, including the limitation of liability and
                indemnity terms.
              </label>
            </div>

            <div className="doc-block">
              <div className="doc-head">
                <h2>Security &amp; Privacy Policy</h2>
              </div>
              <div className="doc-scroll">
                <p>
                  Ayaan-Tinashe acts as the Responsible Party under POPIA for all personal information
                  processed through these platforms. SabelaLogic acts as an Operator, processing data only on
                  Ayaan-Tinashe&rsquo;s instruction.
                </p>
                <h3>What&rsquo;s Collected</h3>
                <ul>
                  <li>Learner data (name, phone, ID, progress, certificates)</li>
                  <li>Employer/client and placement records</li>
                  <li>Compliance documents (UIF, payslips, certification proofs)</li>
                  <li>Phone numbers and codes used for identity verification</li>
                </ul>
                <h3>Third Parties</h3>
                <p>SMS and payment gateways process only the specific data their function requires — never full platform data.</p>
                <h3>Rights &amp; Breach Notification</h3>
                <p>
                  Data subjects may request access, correction, or deletion, subject to legal retention
                  requirements. SabelaLogic notifies Ayaan-Tinashe without undue delay of any security incident
                  affecting personal information.
                </p>
              </div>
            </div>
            <div className="ack-row">
              <input
                type="checkbox"
                id="ackPrivacy"
                checked={ackPrivacy}
                onChange={(e) => setAckPrivacy(e.target.checked)}
              />
              <label htmlFor="ackPrivacy">I have read and accept the Security &amp; Privacy Policy.</label>
            </div>

            <div className="sign-section">
              <div className="sub">Sign as an authorised representative</div>
              <div className="field-row">
                <div className="field">
                  <label>Full name</label>
                  <input
                    type="text"
                    value={signName}
                    onChange={(e) => setSignName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className="field">
                  <label>Title / role</label>
                  <input
                    type="text"
                    value={signTitle}
                    onChange={(e) => setSignTitle(e.target.value)}
                    placeholder="e.g. Director"
                  />
                </div>
              </div>
              <div className="submit-row">
                <button disabled={!ready || submitting} onClick={submit}>
                  Sign &amp; Submit
                </button>
                {status && <div className={`status ${status.error ? "err" : ""}`}>{status.text}</div>}
              </div>
            </div>
          </div>
        ) : (
          <div className="card stamp-view">
            <div className="stamp-ring">
              <span className="check">✓</span>
            </div>
            <h2>Agreement Accepted</h2>
            <p>
              Thank you — your acceptance has been recorded and time-stamped.
              <br />
              Taking you to your build tracker…
            </p>
            <div className="meta">
              {signName} · {signTitle} · {new Date().toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
