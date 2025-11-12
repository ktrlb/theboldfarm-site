/**
 * Email template utilities for The Bold Farm
 * Uses brand colors and styling for consistent email design
 */

// Brand colors from branding guide
export const BRAND_COLORS = {
  boldBlack: '#1A1A1A',
  deepEarthBrown: '#3D2817',
  freshSproutGreen: '#7CB342',
  meadowGreen: '#A8D08D',
  cream: '#F5F1E8',
  honeyGold: '#E8C547',
  skyBlue: '#5B9BD5',
};

// Base URL for the site (used for logo and links)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://theboldfarm.com';

// Logo URL - using the full logo with black text for light backgrounds
const LOGO_URL = `${SITE_URL}/theboldfarm_theBOLDfarm%20-%20black%20text.png`;

interface EmailTemplateOptions {
  title: string;
  content: string;
  footerText?: string;
  showLogo?: boolean;
}

/**
 * Generate a branded HTML email template
 */
export function generateEmailTemplate({
  title,
  content,
  footerText,
  showLogo = true,
}: EmailTemplateOptions): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${BRAND_COLORS.cream}; color: ${BRAND_COLORS.boldBlack}; line-height: 1.6;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${BRAND_COLORS.cream};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header with Logo -->
          ${showLogo ? `
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px; background: linear-gradient(135deg, ${BRAND_COLORS.freshSproutGreen} 0%, ${BRAND_COLORS.meadowGreen} 100%); border-radius: 8px 8px 0 0;">
              <img src="${LOGO_URL}" alt="The Bold Farm" style="max-width: 300px; height: auto; display: block;" />
            </td>
          </tr>
          ` : ''}
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 20px 0; font-family: 'DM Serif Display', Georgia, serif; font-size: 28px; font-weight: 400; color: ${BRAND_COLORS.deepEarthBrown};">
                ${title}
              </h1>
              
              <div style="color: ${BRAND_COLORS.boldBlack}; font-size: 16px;">
                ${content}
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: ${BRAND_COLORS.cream}; border-top: 2px solid ${BRAND_COLORS.meadowGreen}; border-radius: 0 0 8px 8px;">
              ${footerText || `
              <p style="margin: 0 0 10px 0; font-size: 14px; color: ${BRAND_COLORS.deepEarthBrown};">
                <strong>The Bold Farm</strong>
              </p>
              <p style="margin: 0 0 10px 0; font-size: 14px; color: ${BRAND_COLORS.deepEarthBrown};">
                Hood County, Texas
              </p>
              <p style="margin: 0; font-size: 14px;">
                <a href="mailto:karlie@theboldfarm.com" style="color: ${BRAND_COLORS.freshSproutGreen}; text-decoration: none;">karlie@theboldfarm.com</a>
              </p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: ${BRAND_COLORS.deepEarthBrown};">
                <a href="${SITE_URL}" style="color: ${BRAND_COLORS.freshSproutGreen}; text-decoration: none;">Visit our website</a>
              </p>
              `}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Format a field label and value for email display
 */
export function formatEmailField(label: string, value: string | null | undefined): string {
  if (!value) return '';
  return `
    <p style="margin: 0 0 15px 0;">
      <strong style="color: ${BRAND_COLORS.deepEarthBrown};">${label}:</strong> 
      <span style="color: ${BRAND_COLORS.boldBlack};">${escapeHtml(value)}</span>
    </p>
  `;
}

/**
 * Format a message/textarea field for email display
 */
export function formatEmailMessage(label: string, message: string): string {
  return `
    <div style="margin: 0 0 20px 0;">
      <strong style="color: ${BRAND_COLORS.deepEarthBrown}; display: block; margin-bottom: 8px;">${label}:</strong>
      <div style="background-color: ${BRAND_COLORS.cream}; padding: 15px; border-left: 3px solid ${BRAND_COLORS.freshSproutGreen}; border-radius: 4px; color: ${BRAND_COLORS.boldBlack}; white-space: pre-wrap;">
        ${escapeHtml(message).replace(/\n/g, '<br>')}
      </div>
    </div>
  `;
}

/**
 * Create a section divider
 */
export function emailDivider(): string {
  return `
    <hr style="margin: 25px 0; border: none; border-top: 2px solid ${BRAND_COLORS.meadowGreen};" />
  `;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Generate a plain text version of the email
 */
export function generatePlainTextEmail({
  title,
  content,
  footerText,
}: {
  title: string;
  content: string;
  footerText?: string;
}): string {
  return `
${title}

${content}

${footerText || `
The Bold Farm
Hood County, Texas
karlie@theboldfarm.com
${SITE_URL}
`}
  `.trim();
}

