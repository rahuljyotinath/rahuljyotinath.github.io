import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user, pass },
  });
}

export async function sendLeadEmail(lead) {
  const transport = getTransport();
  if (!transport) return false;

  const to = process.env.MAIL_TO || "contact@91skylineworks.com";
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  const body = [
    "New inquiry from 91skylineworks.com",
    "",
    `Name: ${lead.name}`,
    `Phone: ${lead.phone || "—"}`,
    `Email: ${lead.email || "—"}`,
    `Service / topic: ${lead.locality || "—"}`,
    `Source: ${lead.source || "contact"}`,
    "",
    "Message:",
    lead.message || "(none)",
  ];

  if (lead.attachments?.length) {
    body.push("", "Attachments:");
    lead.attachments.forEach((url) => body.push(`https://91skylineworks.com${url}`));
  }

  body.push("", `Submitted: ${new Date().toISOString()}`);

  await transport.sendMail({
    from: `"91SkylineWorks Website" <${from}>`,
    to,
    replyTo: lead.email || undefined,
    subject: `New website lead: ${lead.name}`,
    text: body.join("\n"),
  });

  return true;
}
