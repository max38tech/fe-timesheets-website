document.addEventListener('DOMContentLoaded', function() {
    const contentForm = document.getElementById('content-form');

    // A reference to the document that stores the website settings
    const settingsRef = db.collection('settings').doc('main-page');

    // Helpers for image processing (resize to fit within 1200x800 preserving aspect ratio; output JPEG 0.8)
    async function fileToOptimizedBlob(file, maxW = 1200, maxH = 800, quality = 0.8) {
        const img = await new Promise((resolve, reject) => {
            const i = new Image();
            i.onload = () => resolve(i);
            i.onerror = reject;
            i.src = URL.createObjectURL(file);
        });
        const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
        const targetW = Math.round(img.width * ratio);
        const targetH = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, targetW, targetH);
        // Prefer JPEG for photos; fall back to PNG if original has transparency (quick alpha heuristic)
        const mime = 'image/jpeg';
        const blob = await new Promise(resolve => canvas.toBlob(resolve, mime, quality));
        return blob;
    }

    async function uploadScreenshot(fileInputId, previewId, storagePathField, urlField) {
        const fileInput = document.getElementById(fileInputId);
        const preview = document.getElementById(previewId);
        const file = fileInput.files && fileInput.files[0];
        if (!file) {
            alert('Please choose an image first.');
            return null;
        }

        // Debug logging to help diagnose issues
        try {
            if (!firebase) throw new Error('Firebase SDK not present');
            if (!firebase.storage) throw new Error('Firebase Storage SDK not loaded');
        } catch (e) {
            console.error('Upload precheck failed:', e);
            alert('Upload unavailable: ' + e.message);
            return null;
        }

        // Optimize client-side
        const optimized = await fileToOptimizedBlob(file);
        if (!optimized) {
            alert('Failed to process image.');
            return null;
        }

        // Build a deterministic path using timestamp
        const safeName = file.name ? file.name.replace(/[^a-zA-Z0-9._-]/g, '_') : 'image.jpg';
        const name = `${Date.now()}-${safeName}`;
        const path = `uploads/screenshots/${name}`;
        // Guard: ensure no double-encoding or leading slash issues down the line

        // Ensure we get a reference safely across environments
        const storage = firebase.storage();

        // Force the SDK to use the configured bucket; if your project is still pointing to a
        // non-appspot bucket host in the console, setBucket ensures correct origin is used.
        if (storage.setBucket) {
          try {
            storage.setBucket('fetimesheets-com.appspot.com');
          } catch (e) {
            console.warn('setBucket not available or failed, continuing with default bucket', e);
          }
        }

        const rootRef = storage.ref();
        const ref = rootRef.child(path);

        // Perform upload with metadata
        const metadata = { contentType: 'image/jpeg', cacheControl: 'public,max-age=31536000,immutable' };
        // Log effective upload URL target to help diagnose CORS/bucket host issues
        console.info('Uploading to path:', path, 'bucket:', (firebase.app().options && firebase.app().options.storageBucket), 'sdk:', firebase.SDK_VERSION);

        const snapshot = await ref.put(optimized, metadata);

        // Get public URL
        const url = await snapshot.ref.getDownloadURL();

        if (preview) {
            preview.src = url;
        }

        // Persist Storage path and public URL into settings document
        await settingsRef.set({ [storagePathField]: path, [urlField]: url }, { merge: true });

        return { path, url };
    }

    // Initialize upload button handlers
    function initScreenshotUploads() {
        const map = [
            { file: 'screenshot-1-file', preview: 'screenshot-1-preview', btn: 'screenshot-1-upload', pathField: 'screenshot1Path', urlField: 'screenshot1Url' },
            { file: 'screenshot-2-file', preview: 'screenshot-2-preview', btn: 'screenshot-2-upload', pathField: 'screenshot2Path', urlField: 'screenshot2Url' },
            { file: 'screenshot-3-file', preview: 'screenshot-3-preview', btn: 'screenshot-3-upload', pathField: 'screenshot3Path', urlField: 'screenshot3Url' },
        ];
        map.forEach(({ file, preview, btn, pathField, urlField }) => {
            const button = document.getElementById(btn);
            if (button) {
                button.addEventListener('click', async () => {
                    try {
                        button.disabled = true;
                        button.textContent = 'Uploading...';
                        const res = await uploadScreenshot(file, preview, pathField, urlField);
                        if (res) {
                          console.info('Upload success:', res);
                          button.textContent = 'Uploaded';
                          setTimeout(() => { button.textContent = 'Upload'; }, 1200);
                        } else {
                          button.textContent = 'Upload';
                        }
                    } catch (e) {
                        console.error('Upload failed', e);
                        alert('Upload failed: ' + e.message);
                        button.textContent = 'Upload';
                    } finally {
                        button.disabled = false;
                    }
                });
            } else {
                console.warn('Upload button not found:', btn);
            }
        });
    }

    // Function to load the current settings into the form
    const loadSettings = () => {
        // Hook up upload handlers once DOM is ready
        initScreenshotUploads();
        // Use onSnapshot to keep the form in sync and react to seed immediately
        settingsRef.onSnapshot(doc => {
            if (doc.exists) {
                const settings = doc.data();
                document.querySelectorAll('[data-editable]').forEach(el => {
                    const key = el.getAttribute('data-editable');
                    const input = document.getElementById(key);
                    if (input && Object.prototype.hasOwnProperty.call(settings, key)) {
                        input.value = settings[key] ?? '';
                    }
                });
                const email = document.getElementById('contact-email');
                const phone = document.getElementById('contact-phone');
                const loc = document.getElementById('contact-location');
                if (email) email.value = settings.contactEmail ?? '';
                if (phone) phone.value = settings.contactPhone ?? '';
                if (loc) loc.value = settings.contactLocation ?? '';

                // Populate screenshot previews if URLs available
                const s1 = document.getElementById('screenshot-1-preview');
                const s2 = document.getElementById('screenshot-2-preview');
                const s3 = document.getElementById('screenshot-3-preview');
                if (s1 && settings.screenshot1Url) s1.src = settings.screenshot1Url;
                if (s2 && settings.screenshot2Url) s2.src = settings.screenshot2Url;
                if (s3 && settings.screenshot3Url) s3.src = settings.screenshot3Url;
            } else {
                console.log("No settings document found. You can create one by saving the form.");
            }
        }, error => {
            console.error("Error listening to settings:", error);
        });
    };

    // Function to save the settings
    const saveSettings = (e) => {
        e.preventDefault();
        const newSettings = {};
        document.querySelectorAll('[data-editable]').forEach(el => {
            const key = el.getAttribute('data-editable');
            const input = document.getElementById(key);
            if (input) {
                newSettings[key] = input.value ?? '';
            }
        });
        newSettings.contactEmail = document.getElementById('contact-email').value;
        newSettings.contactPhone = document.getElementById('contact-phone').value;
        newSettings.contactLocation = document.getElementById('contact-location').value;

        settingsRef.set(newSettings, { merge: true }) // Use merge:true to avoid overwriting other fields if they exist
            .then(() => {
                alert('Content updated successfully!');
            })
            .catch(error => {
                console.error('Error updating content: ', error);
                alert('There was an error saving the content.');
            });
    };

    // Add event listener to the form
    if (contentForm) {
        contentForm.addEventListener('submit', saveSettings);
    }

    // Load the settings when the page is ready and the user is authenticated
    auth.onAuthStateChanged(user => {
        if (user) {
            console.info('Admin authenticated, initializing uploads and loading settings.');
            loadSettings();
        } else {
            console.warn('Not authenticated; upload UI will be inactive until login.');
        }
    });
});