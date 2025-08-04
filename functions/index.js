const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { setGlobalOptions } = require("firebase-functions/v2");
const { defineSecret } = require("firebase-functions/v2/params");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();
setGlobalOptions({ maxInstances: 10 });

// Define the SendGrid API Key as a secret that the function needs
const sendgridApiKey = defineSecret("SENDGRID_KEY");

const SENDGRID_SENDER = "shawn.shiobara@gmail.com";
const CONTACT_FORM_RECIPIENT = "info@fetimesheets.com";

exports.sendContactFormEmail = onDocumentCreated(
    {
        document: "contacts/{contactId}",
        // Make the secret available to this function's runtime environment
        secrets: [sendgridApiKey],
    },
    (event) => {
        const snap = event.data;
        if (!snap) {
            console.log("No data associated with the event");
            return;
        }
        const contact = snap.data();

        // Access the secret's value
        sgMail.setApiKey(sendgridApiKey.value());

        const msg = {
            to: CONTACT_FORM_RECIPIENT,
            from: SENDGRID_SENDER,
            subject: `New Contact Form Submission from ${contact.name}`,
            html: `
                <p><strong>Name:</strong> ${contact.name}</p>
                <p><strong>Email:</strong> ${contact.email}</p>
                <p><strong>Company:</strong> ${contact.company}</p>
                <p><strong>Message:</strong> ${contact.message}</p>
            `,
        };

        console.log("Sending email...");
        return sgMail.send(msg).then(() => {
            console.log("Email sent successfully.");
        }).catch(error => {
            // Log the detailed error from SendGrid
            console.error("Error sending email:", JSON.stringify(error));
        });
    }
);