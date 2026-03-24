/**
 * server/_core/emailBranding.ts
 *
 * Shared email branding constants and HTML helpers for itsdad.io.
 * All outbound emails use these utilities to ensure consistent
 * royal purple / gold visual identity.
 */

// ─── Brand Colors ─────────────────────────────────────────────────────────────

export const EMAIL_COLORS = {
  royalPurple: "#4c1d95",
  royalPurpleLight: "#7c3aed",
  royalGold: "#f59e0b",
  royalGoldLight: "#fbbf24",
  darkBg: "#1e293b",
  bodyText: "#475569",
  mutedText: "#94a3b8",
  borderLight: "#e2e8f0",
  successGreen: "#10b981",
  white: "#ffffff",
};

// ─── Signature Image ──────────────────────────────────────────────────────────

/**
 * Hosted URL for the "Its Daddio" signature image.
 * Replace with the actual CDN URL once the asset is uploaded.
 */
export const ITS_DADDIO_SIGNATURE_URL =
  process.env.SIGNATURE_IMAGE_URL ||
  "https://www.itsdad.io/assets/itsdaddio-signature.png";

// ─── Header ───────────────────────────────────────────────────────────────────

interface HeaderOptions {
  subtitle?: string;
}

/**
 * Returns the HTML for the royal purple email header with the Its Dad logo wordmark.
 */
export function getRoyalEmailHeader({ subtitle }: HeaderOptions = {}): string {
  return `
    <tr>
      <td style="background: linear-gradient(135deg, ${EMAIL_COLORS.royalPurple} 0%, #6d28d9 100%); padding: 30px 40px; border-radius: 12px 12px 0 0; text-align: center;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <!-- Crown icon SVG inline for email client compatibility -->
              <div style="display: inline-block; margin-bottom: 12px;">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 20h20M5 20V10l7-6 7 6v10" stroke="${EMAIL_COLORS.royalGold}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 20v-5h6v5" stroke="${EMAIL_COLORS.royalGold}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h1 style="margin: 0; color: ${EMAIL_COLORS.white}; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                itsdad.io
              </h1>
              ${
                subtitle
                  ? `<p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.75); font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${subtitle}</p>`
                  : ""
              }
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

// ─── Footer ───────────────────────────────────────────────────────────────────

interface FooterOptions {
  includeSignature?: boolean;
}

/**
 * Returns the HTML for the standard email footer with legal copy and unsubscribe link.
 */
export function getRoyalEmailFooter({ includeSignature = true }: FooterOptions = {}): string {
  const baseUrl = process.env.VITE_APP_URL || "https://www.itsdad.io";

  return `
    <tr>
      <td style="background-color: #f8fafc; padding: 30px 40px; border-radius: 0 0 12px 12px; border-top: 1px solid ${EMAIL_COLORS.borderLight};">
        ${
          includeSignature
            ? `
          <table cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
            <tr>
              <td style="padding-right: 20px;">
                <img src="${ITS_DADDIO_SIGNATURE_URL}" alt="Its Daddio" width="120" height="32" style="display: block;" />
              </td>
              <td style="border-left: 2px solid ${EMAIL_COLORS.royalGold}; padding-left: 16px;">
                <p style="margin: 0; color: ${EMAIL_COLORS.darkBg}; font-size: 13px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Its Daddio</p>
                <p style="margin: 3px 0 0 0; color: ${EMAIL_COLORS.bodyText}; font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Founder & Executive Facilitator, itsdad.io</p>
              </td>
            </tr>
          </table>
        `
            : ""
        }
        <p style="margin: 0 0 8px 0; color: ${EMAIL_COLORS.mutedText}; font-size: 11px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          itsdad.io · Affiliate Marketing Facilitation Hub · <a href="${baseUrl}" style="color: ${EMAIL_COLORS.royalGold}; text-decoration: none;">itsdad.io</a>
        </p>
        <p style="margin: 0 0 8px 0; color: ${EMAIL_COLORS.mutedText}; font-size: 11px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          Commissions are earned on product sales. Individual results vary and are not guaranteed.
        </p>
        <p style="margin: 0; color: ${EMAIL_COLORS.mutedText}; font-size: 11px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <a href="${baseUrl}/unsubscribe" style="color: ${EMAIL_COLORS.mutedText}; text-decoration: underline;">Unsubscribe</a>
          &nbsp;·&nbsp;
          <a href="${baseUrl}/privacy" style="color: ${EMAIL_COLORS.mutedText}; text-decoration: underline;">Privacy Policy</a>
        </p>
      </td>
    </tr>
  `;
}

// ─── Gold CTA Button ──────────────────────────────────────────────────────────

/**
 * Returns a full-width gold CTA button for use inside email body content.
 */
export function getGoldButton(label: string, href: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
      <tr>
        <td align="center">
          <a
            href="${href}"
            style="
              display: inline-block;
              background: linear-gradient(135deg, ${EMAIL_COLORS.royalGold} 0%, ${EMAIL_COLORS.royalGoldLight} 100%);
              color: #1e293b;
              font-size: 16px;
              font-weight: 700;
              text-decoration: none;
              padding: 16px 40px;
              border-radius: 10px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              letter-spacing: 0.3px;
            "
          >
            ${label} →
          </a>
        </td>
      </tr>
    </table>
  `;
}
