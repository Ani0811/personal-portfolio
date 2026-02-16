/**
 * Shared email HTML templates
 */

const palette = {
  bg: '#061226',
  card: '#0a1a2f',
  cardBorder: 'rgba(255,255,255,0.06)',
  primary: '#3b82f6',
  accent: '#06b6d4',
  text: '#e6eef7',
  muted: '#94a3b8',
  divider: 'rgba(255,255,255,0.08)',
};

const baseWrapper = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background-color: ${palette.bg};
  color: ${palette.text};
  border-radius: 12px;
  overflow: hidden;
`;

const headerBar = `
  background: linear-gradient(135deg, ${palette.primary} 0%, ${palette.accent} 100%);
  padding: 32px 24px;
  text-align: center;
`;

/* ─────────────── Notification Email (to you) ─────────────── */

function buildNotificationHtml(contact, createdAt) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:24px 12px;background-color:#050e1d;">
  <div style="${baseWrapper}">

    <!-- Header -->
    <div style="${headerBar}">
      <h1 style="margin:0;font-size:22px;font-weight:700;color:#fff;letter-spacing:0.5px;">
        ✦ New Portfolio Contact
      </h1>
      <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">${createdAt}</p>
    </div>

    <!-- Body -->
    <div style="padding:28px 24px;">

      <!-- Sender card -->
      <div style="background:${palette.card};border:1px solid ${palette.cardBorder};border-radius:10px;padding:20px;margin-bottom:20px;">
        <table role="presentation" style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;width:90px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${palette.muted};vertical-align:top;">Name</td>
            <td style="padding:6px 0;font-size:15px;color:${palette.text};font-weight:600;">${contact.name}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${palette.muted};vertical-align:top;">Email</td>
            <td style="padding:6px 0;font-size:15px;">
              <a href="mailto:${contact.email}" style="color:${palette.accent};text-decoration:none;">${contact.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${palette.muted};vertical-align:top;">Phone</td>
            <td style="padding:6px 0;font-size:15px;color:${palette.text};">${contact.phone_number || '—'}</td>
          </tr>
        </table>
      </div>

      <!-- Message -->
      <div style="background:${palette.card};border:1px solid ${palette.cardBorder};border-radius:10px;padding:20px;">
        <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${palette.muted};">Message</p>
        <p style="margin:0;font-size:15px;line-height:1.7;color:${palette.text};white-space:pre-wrap;">${contact.message}</p>
      </div>

      <!-- Quick reply button -->
      <div style="text-align:center;margin-top:24px;">
        <a href="mailto:${contact.email}?subject=Re: Portfolio Contact"
           style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,${palette.primary},${palette.accent});color:#fff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
          Reply to ${contact.name}
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:16px 24px;border-top:1px solid ${palette.divider};text-align:center;">
      <p style="margin:0;font-size:12px;color:${palette.muted};">Anirudha Basu Thakur — Portfolio Contact System</p>
    </div>
  </div>
</body>
</html>`;
}

/* ─────────────── Auto-Reply Email (to sender) ─────────────── */

function buildAutoReplyHtml(contact) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:24px 12px;background-color:#050e1d;">
  <div style="${baseWrapper}">

    <!-- Header -->
    <div style="${headerBar}">
      <h1 style="margin:0;font-size:22px;font-weight:700;color:#fff;letter-spacing:0.5px;">
        Thanks for reaching out!
      </h1>
    </div>

    <!-- Body -->
    <div style="padding:28px 24px;">
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${palette.text};">
        Hi <strong>${contact.name}</strong>,
      </p>

      <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${palette.text};">
        Thank you for getting in touch through my portfolio. I've received your message and will get back to you as soon as possible — usually within 24-48 hours.
      </p>

      <!-- Copy of their message -->
      <div style="background:${palette.card};border:1px solid ${palette.cardBorder};border-radius:10px;padding:20px;margin:20px 0;">
        <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${palette.muted};">Your Message</p>
        <p style="margin:0;font-size:14px;line-height:1.7;color:${palette.muted};white-space:pre-wrap;font-style:italic;">${contact.message}</p>
      </div>

      <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:${palette.text};">
        In the meantime, feel free to check out more of my work:
      </p>

      <!-- Links -->
      <div style="text-align:center;margin-bottom:8px;">
        <a href="https://personal-portfolio-three-delta-53.vercel.app"
           style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,${palette.primary},${palette.accent});color:#fff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
          Visit My Portfolio
        </a>
      </div>

      <div style="text-align:center;margin-top:12px;">
        <a href="https://linktr.ee/AnirudhaBasuThakur"
           style="display:inline-block;padding:10px 24px;border:1px solid ${palette.accent};color:${palette.accent};font-size:13px;font-weight:600;text-decoration:none;border-radius:8px;">
          Linktree
        </a>
      </div>
    </div>

    <!-- Sign-off -->
    <div style="padding:0 24px 24px;text-align:left;">
      <p style="margin:0;font-size:15px;color:${palette.text};">Best regards,</p>
      <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:${palette.accent};">Anirudha Basu Thakur</p>
      <p style="margin:2px 0 0;font-size:13px;color:${palette.muted};">Full-Stack Developer</p>
    </div>

    <!-- Footer -->
    <div style="padding:16px 24px;border-top:1px solid ${palette.divider};text-align:center;">
      <p style="margin:0;font-size:11px;color:${palette.muted};">
        This is an automated confirmation. Please do not reply to this email.
      </p>
    </div>
  </div>
</body>
</html>`;
}

module.exports = {
  buildNotificationHtml,
  buildAutoReplyHtml,
};
