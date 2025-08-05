(function seedModule() {
  const logEl = document.getElementById('log');
  const seedBtn = document.getElementById('seed-btn');
  const wipeBtn = document.getElementById('wipe-btn');
  const authState = document.getElementById('auth-state');

  const ALLOWED_EMAILS = [
    // Add allowed admin emails here
    // "admin@example.com",
  ];

  function log(line, cls) {
    const div = document.createElement('div');
    if (cls) div.className = cls;
    const ts = new Date().toISOString();
    div.textContent = `[${ts}] ${line}`;
    logEl.appendChild(div);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function setButtonsEnabled(enabled) {
    seedBtn.disabled = !enabled;
    wipeBtn.disabled = !enabled;
  }

  function checkAuthorization(user) {
    if (!user) return false;
    if (ALLOWED_EMAILS.length === 0) {
      // If no allowed list configured, default to signed-in only
      return true;
    }
    return ALLOWED_EMAILS.includes(user.email);
  }

  function placeholderPayload() {
    return {
      // Hero
      'hero-h1': 'Streamline Time Tracking for Your Field Engineers',
      'hero-p': 'FE Timesheets is the perfect solution for small to medium-sized technical contracting companies.',
      // Features section
      'features-h2': 'Powerful Features',
      'features-p': 'Everything you need to manage time tracking efficiently',
      'feature-1-h3': 'Mobile-Friendly',
      'feature-1-p': 'Track time and submit timesheets directly from mobile devices.',
      'feature-2-h3': 'Simple Approval',
      'feature-2-p': 'Clients can approve timesheets via one-time links sent by email.',
      'feature-3-h3': 'Advanced Reporting',
      'feature-3-p': 'Generate detailed reports by period, client, project, or engineer.',
      'feature-4-h3': 'User Management',
      'feature-4-p': 'Manage users, roles, and permissions with ease.',
      // Pricing
      'pricing-h2': 'Simple, Transparent Pricing',
      'pricing-p': 'Choose the plan that works best for your business',
      // Screenshots
      'screenshots-h2': 'Easy to Use Interface',
      'screenshots-p': 'See how FE Timesheets works in action',
      // Contact
      'contact-h2': 'Schedule a Demo',
      'contact-p': 'Ready to get started? Contact us for a personalized demo',
      contactEmail: 'info@fetimesheets.com',
      contactPhone: '+1 (555) 123-4567',
      contactLocation: 'San Francisco, CA',
      // Meta
      seededAt: firebase.firestore.FieldValue.serverTimestamp(),
      seededBy: auth.currentUser ? auth.currentUser.email : null,
      _seedNote: 'This document contains placeholder website content for FE Timesheets.',
    };
  }

  async function seed() {
    try {
      setButtonsEnabled(false);
      log('Starting seeding…');
      const docRef = db.collection('settings').doc('main-page');
      const payload = placeholderPayload();
      await docRef.set(payload, { merge: true });
      log('settings/main-page upserted successfully.', 'ok');
      log('Done.');
    } catch (err) {
      console.error(err);
      log(`Error: ${err.message}`, 'err');
      alert('Seeding failed. See log for details.');
    } finally {
      setButtonsEnabled(true);
    }
  }

  async function wipe() {
    if (!confirm('Delete the document settings/main-page? This cannot be undone.')) {
      return;
    }
    try {
      setButtonsEnabled(false);
      log('Deleting settings/main-page…');
      const docRef = db.collection('settings').doc('main-page');
      await docRef.delete();
      log('Deleted settings/main-page.', 'ok');
    } catch (err) {
      console.error(err);
      log(`Error: ${err.message}`, 'err');
      alert('Delete failed. See log for details.');
    } finally {
      setButtonsEnabled(true);
    }
  }

  function updateAuthUI(user) {
    if (user) {
      const authorized = checkAuthorization(user);
      if (authorized) {
        authState.textContent = `Signed in as ${user.email} (authorized)`;
        authState.className = 'pill';
        setButtonsEnabled(true);
        log(`Authorized user: ${user.email}`, 'ok');
      } else {
        authState.textContent = `Signed in as ${user.email} (not authorized)`;
        authState.className = 'pill';
        setButtonsEnabled(false);
        log(`User ${user.email} is not authorized to seed.`, 'err');
      }
    } else {
      authState.textContent = 'Not signed in';
      authState.className = 'pill';
      setButtonsEnabled(false);
      log('Please sign in from admin.html first. Seeding is disabled.', 'err');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    setButtonsEnabled(false);
    seedBtn.addEventListener('click', seed);
    wipeBtn.addEventListener('click', wipe);

    // Ensure Firebase SDK and app are ready, and recover auth/db if not on window
    if (!window.firebase) {
      log('Firebase SDK not loaded. Ensure script tags for firebase-app.js are before seed.js.', 'err');
      return;
    }
    try {
      // If firebase app exists but auth/db globals not present on window, recover them.
      if ((!window.auth || !window.db) && firebase.apps && firebase.apps.length) {
        window.auth = window.auth || firebase.auth();
        window.db = window.db || firebase.firestore();
      }
    } catch (e) {
      // ignore; will fall through to final check
    }
    if (!window.auth || !window.db) {
      log('Firebase loaded but auth/db not available. Ensure firebase.js runs before seed.js, or that it exposes auth and db.', 'err');
      return;
    }

    auth.onAuthStateChanged((user) => {
      updateAuthUI(user);
    });
  });
})();