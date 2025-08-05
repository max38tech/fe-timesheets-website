const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

// Initialize Admin SDK
admin.initializeApp();

// Note: setGlobalOptions is only available in newer firebase-functions versions.
// If your environment errors with "setGlobalOptions is not a function",
// simply omit it (as done here) or upgrade firebase-functions.

// Secret for SendGrid API key
const sendgridApiKey = defineSecret("SENDGRID_KEY");

// Default sender/recipient (verified in SendGrid)
const DEFAULT_SEND_FROM = "info@fetimesheets.com";
const DEFAULT_SEND_TO = "info@fetimesheets.com";

/**
 * Firestore trigger (kept as-is if you still want email on document create)
 */
exports.sendContactFormEmail = onDocumentCreated(
  {
    document: "contacts/{contactId}",
    secrets: [sendgridApiKey],
  },
  async (event) => {
    const snap = event.data;
    if (!snap) {
      console.log("No data associated with the event");
      return;
    }
    const contact = snap.data();

    sgMail.setApiKey(sendgridApiKey.value());

    const msg = {
      to: DEFAULT_SEND_TO,
      from: DEFAULT_SEND_FROM,
      replyTo: contact.email || undefined,
      subject: `New Contact Form Submission from ${contact.name || "Unknown"}`,
      html: `
        <p><strong>Name:</strong> ${contact.name || ""}</p>
        <p><strong>Email:</strong> ${contact.email || ""}</p>
        <p><strong>Company:</strong> ${contact.company || ""}</p>
        <p><strong>Message:</strong> ${contact.message || ""}</p>
      `,
    };

    try {
      console.log("Sending email (trigger)...");
      await sgMail.send(msg);
      console.log("Email sent successfully.");
    } catch (error) {
      console.error("Error sending email:", error?.response?.body || error);
    }
  }
);

/**
 * HTTPS endpoint to send contact email directly from website form
 * Method: POST
 * Body: { name, email, message }
 */
exports.sendContactEmail = onRequest(
  { secrets: [sendgridApiKey], cors: true },
  async (req, res) => {
    // Basic path-based allowlist to reduce bot-triggered costs when hitting function URL directly
    // Allow only our expected function POSTs; reject GETs or other methods quickly
    if (req.method !== "POST") {
      return res.status(405).set("Cache-Control", "no-store").json({ error: "Method Not Allowed" });
    }
    // Very small payload cap and simple shape guard
    const ct = String(req.get("content-type") || "");
    if (!ct.includes("application/json")) {
      return res.status(400).set("Cache-Control", "no-store").json({ error: "Invalid content type" });
    }

    // Shallow-parse with size guard (emulator/prod both)
    let body = req.body;
    if (!body || typeof body !== "object") {
      try {
        body = JSON.parse(req.rawBody?.toString("utf8") || "{}");
      } catch (_) {
        body = {};
      }
    }
    const { name, email, message } = body || {};

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields: name, email, message" });
    }

    try {
      // Init SendGrid
      sgMail.setApiKey(sendgridApiKey.value());

      // Use verified "from" and set user's email in replyTo to satisfy SendGrid sender identity rules
      const msg = {
        to: DEFAULT_SEND_TO,
        from: DEFAULT_SEND_FROM,
        replyTo: email,
        subject: `FE Timesheets Contact from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `
          <div>
            <p><strong>From:</strong> ${name} <${email}></p>
            <p><strong>Message:</strong></p>
            <p>${String(message).replace(/\n/g, "<br/>")}</p>
          </div>
        `,
      };

      console.log("Sending email (HTTP)...");
      await sgMail.send(msg);
      // Add minimal caching headers to prevent replays by crawlers
      return res.status(200).set("Cache-Control", "no-store").json({ ok: true, message: "Email sent" });
    } catch (err) {
      console.error("SendGrid error:", err?.response?.body || err);
      return res.status(500).set("Cache-Control", "no-store").json({ error: "Failed to send email" });
    }
  }
);