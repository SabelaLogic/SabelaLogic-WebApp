import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";

export const metadata: Metadata = pageMetadata({
  title: "Spaza Shelf Sort: Privacy Policy — Sabela Logic",
  description: "Privacy policy for the Spaza Shelf Sort game (Android and web). No personal data is collected.",
  path: "/privacy/spaza-shelf-sort",
});

const POLICY_HTML = "<p><em>Effective: 19 October 2026 \u00b7 App: Spaza Shelf Sort (Android and web) \u00b7 Developer: Lunga Xhamela (SabelaLogic), Bloemfontein, South Africa \u00b7 Contact: <a href=\"mailto:lungaxhamela86@gmail.com\">lungaxhamela86@gmail.com</a></em></p>\n<h2>Summary</h2>\n<p>Spaza Shelf Sort does not collect, store or share any personal information. It has no accounts, no analytics, no tracking and no advertising in the Android app.</p>\n<h2>Data stored on your device</h2>\n<p>The game saves your progress on your own device (browser local storage or the app's local storage). This covers level reached, stars, coins, lives, boosters, streak, cosmetic unlocks and sound/vibration settings. None of it is sent to us. Clearing the app's data or uninstalling the app deletes it.</p>\n<h2>Permissions</h2>\n<p>The Android app requests only Internet access and vibration (for haptic feedback). Neither involves personal data. It does not access your location, contacts, camera, microphone, photos or device identifiers.</p>\n<h2>Advertising and analytics</h2>\n<p>The Android app contains no advertising or analytics SDKs. Optional \"watch an ad\" buttons in the Android build simply grant the reward without showing an ad. The web version shows ads only when it is played on the CrazyGames or Poki game portals, which load their own SDKs under their own privacy policies. Everywhere else, including itch.io, the web version shows no ads.</p>\n<h2>Purchases</h2>\n<p>In-app purchases are not active in this version. If they are added later, payment is handled by the store's own billing system (or by Paystack on the web), and we would receive only a transaction reference, never your card details. This policy will be updated before purchases go live.</p>\n<h2>Children</h2>\n<p>The game is suitable for all ages and knowingly collects no data from anyone, including children.</p>\n<h2>Changes</h2>\n<p>If this policy changes, the updated version will be posted at this address with a new effective date.</p>";

export default function SpazaShelfSortPrivacyPage() {
  return (
    <div className="max-w-full overflow-x-hidden bg-ink font-mono text-bone">
      <Nav />
      <main id="main-content">
        <section className="border-b border-hairline px-[clamp(16px,4vw,48px)] py-[clamp(48px,6vw,72px)]">
          <div className="mx-auto max-w-[760px]">
            <h1 className="mb-6 font-display text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.06] tracking-[-0.025em]">
              Spaza Shelf Sort: Privacy Policy
            </h1>
            <div
              className="text-[13.5px] leading-[1.8] text-bone-dim [&_a]:text-signal [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-[20px] [&_h2]:font-semibold [&_h2]:text-bone [&_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: POLICY_HTML }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
