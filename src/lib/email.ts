import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  });
}

async function sendMail(to: string, subject: string, html: string) {
  const transport = getTransport();
  if (!transport) {
    console.warn(
      `[email] SMTP not configured — skipping email to ${to}: ${subject}`,
    );
    return;
  }

  await transport.sendMail({
    from: process.env.SMTP_FROM ?? "no-reply@permanentsoundsrecords.com",
    to,
    subject,
    html,
  });
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  orderId: string;
  items: { beatTitle: string; licenseName: string; downloadUrl: string }[];
}) {
  const html = `
    <h2>Thanks for your purchase — Permanent Sounds Records</h2>
    <p>Order #${params.orderId}</p>
    <ul>
      ${params.items
        .map(
          (item) =>
            `<li>${item.beatTitle} — ${item.licenseName}: <a href="${item.downloadUrl}">Download</a></li>`,
        )
        .join("")}
    </ul>
    <p>Download links expire in 30 days. You can also access your files anytime from your account.</p>
  `;
  await sendMail(params.to, "Your Permanent Sounds Records order", html);
}

export async function sendBookingConfirmationEmail(params: {
  to: string;
  serviceName: string;
  date: string;
  startTime: string;
}) {
  const html = `
    <h2>Booking Confirmed — Permanent Sounds Records</h2>
    <p>${params.serviceName} on ${params.date} at ${params.startTime}.</p>
    <p>We'll see you at the studio.</p>
  `;
  await sendMail(params.to, "Your studio session is confirmed", html);
}
